import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { TuitionForm } from "../../../components/dashboard/TuitionFormModal";

/** Students create a tuition post. It is saved as "Pending" until an admin approves it. */
const PostTuition = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await axiosSecure.post("/tuitions", {
        ...values,
        studentName: user?.displayName || "",
        studentEmail: user?.email,
        status: "Pending",
      });

      await Swal.fire({
        icon: "success",
        title: "Tuition submitted!",
        text: "Your post is now pending admin approval.",
        confirmButtonColor: "#0F294A",
      });
      navigate("/dashboard/my-tuitions");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not post your tuition.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="card-surface p-6 md:p-8">
        <h2 className="text-2xl font-bold text-navy">Post a new tuition</h2>
        <p className="mb-6 mt-1 text-sm text-slate-500">
          Tell tutors what you need. Approved posts appear on the Tuitions page.
        </p>
        <TuitionForm
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Submit for Approval"
        />
      </div>
    </div>
  );
};

export default PostTuition;