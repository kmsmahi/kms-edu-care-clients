import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { MdArrowBack, MdLock } from "react-icons/md";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/Shared/LoadingSpinner";
import { formatMoney } from "../../../Components/Dashboard/StatsCard";

// Publishable key only. Created once, outside the component.
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

/** The card form. Rendered inside <Elements>. */
const CheckoutForm = ({ application, intent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setPaying(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/dashboard/payments` },
      redirect: "if_required", // stay on this page for card payments
    });

    if (error) {
      toast.error(error.message || "Payment failed. Please try again.");
      setPaying(false);
      return;
    }

    if (paymentIntent?.status !== "succeeded") {
      toast("Your payment is still processing.", { icon: "⏳" });
      setPaying(false);
      return;
    }

    // Payment succeeded → the server verifies it with Stripe, THEN approves the tutor
    try {
      await axiosSecure.post("/payments/confirm", {
        applicationId: application._id,
        paymentIntentId: paymentIntent.id,
      });
      await Swal.fire({
        icon: "success",
        title: "Payment successful!",
        text: `${application.tutorName} has been approved for your tuition.`,
        confirmButtonColor: "#0F294A",
      });
      navigate("/dashboard/payments", { replace: true });
    } catch (err) {
      await Swal.fire({
        icon: "warning",
        title: "Payment received",
        text:
          err?.response?.data?.message ||
          `We could not update the application automatically. Please contact support with reference ${paymentIntent.id}.`,
        confirmButtonColor: "#0F294A",
      });
      navigate("/dashboard/applied-tutors", { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button type="submit" disabled={!stripe || paying} className="btn-brand h-12 w-full">
        {paying ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <>
            <MdLock className="h-5 w-5" /> Pay {formatMoney(intent.amount, intent.currency)}
          </>
        )}
      </button>
      <p className="text-center text-xs text-slate-500">
        Payments are processed securely by Stripe. We never store your card details.
      </p>
    </form>
  );
};

const PaymentCheckout = () => {
  const { applicationId } = useParams();
  const axiosSecure = useAxiosSecure();
  const [state, setState] = useState({
    loading: true,
    error: "",
    application: null,
    intent: null,
  });
  const requestedFor = useRef(null); // prevents a duplicate PaymentIntent in StrictMode

  useEffect(() => {
    if (requestedFor.current === applicationId) return;
    requestedFor.current = applicationId;

    (async () => {
      try {
        const { data: application } = await axiosSecure.get(`/applications/${applicationId}`);

        if (application.status !== "Pending") {
          return setState({
            loading: false,
            error: `This application is already ${String(application.status).toLowerCase()}.`,
            application: null,
            intent: null,
          });
        }

        // Server calculates the amount from the application, never from the client
        const { data: intent } = await axiosSecure.post("/payments/create-intent", {
          applicationId,
        });
        setState({ loading: false, error: "", application, intent });
      } catch (err) {
        setState({
          loading: false,
          error: err?.response?.data?.message || "Could not start checkout.",
          application: null,
          intent: null,
        });
      }
    })();
  }, [applicationId, axiosSecure]);

  const { loading, error, application, intent } = state;

  if (loading) return <LoadingSpinner label="Preparing secure checkout..." />;

  if (!stripePromise || error || !application || !intent) {
    return (
      <div className="card-surface mx-auto max-w-lg p-10 text-center">
        <h2 className="text-xl font-bold text-navy">Checkout unavailable</h2>
        <p className="mt-2 text-slate-600">
          {!stripePromise
            ? "Stripe is not configured (missing VITE_STRIPE_PUBLISHABLE_KEY)."
            : error || "Something went wrong."}
        </p>
        <Link to="/dashboard/applied-tutors" className="btn-brand mt-6 inline-flex">
          Back to applicants
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/dashboard/applied-tutors"
        className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-teal hover:underline"
      >
        <MdArrowBack /> Back to applicants
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Order summary */}
        <aside className="card-surface h-fit p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-navy">Order summary</h2>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-teal/30 bg-navy text-lg font-bold text-white">
              {application.tutorPhoto ? (
                <img
                  src={application.tutorPhoto}
                  alt={application.tutorName}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                (application.tutorName || "T").charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy">{application.tutorName}</p>
              <p className="truncate text-xs text-slate-500">{application.qualifications}</p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Tuition</dt>
              <dd className="text-right font-medium text-navy">
                {application.tuition?.subject || "Tuition"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Expected salary</dt>
              <dd className="font-medium text-navy">
                ৳{Number(application.expectedSalary || 0).toLocaleString()}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-slate-100 pt-3 text-base">
              <dt className="font-semibold text-navy">Total due</dt>
              <dd className="font-extrabold text-teal">
                {formatMoney(intent.amount, intent.currency)}
              </dd>
            </div>
          </dl>
        </aside>

        {/* Stripe payment form */}
        <section className="card-surface p-6 lg:col-span-3">
          <h2 className="mb-5 text-lg font-bold text-navy">Payment details</h2>
          <Elements
            key={intent.clientSecret}
            stripe={stripePromise}
            options={{
              clientSecret: intent.clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#0E8A8C",
                  colorText: "#0F294A",
                  fontFamily: "Inter, sans-serif",
                  borderRadius: "8px",
                },
              },
            }}
          >
            <CheckoutForm application={application} intent={intent} />
          </Elements>
        </section>
      </div>
    </div>
  );
};

export default PaymentCheckout;