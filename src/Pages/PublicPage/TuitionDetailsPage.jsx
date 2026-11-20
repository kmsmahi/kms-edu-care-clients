import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  MdAccessTime,
  MdArrowBack,
  MdCalendarMonth,
  MdCheckCircle,
  MdLocationOn,
  MdPerson,
  MdSchool,
} from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import ApplyTuitionModal from "../../components/tuitions/ApplyTuitionModal";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const DetailRow = ({ Icon, label, value }) => (
  <li className="flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="font-semibold text-navy">{value}</p>
    </div>
  </li>
);

const TuitionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, authLoading } = useAuth();
  const { role, roleLoading } = useUserRole();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    axios
      .get(`${API_URL}/tuitions/${id}`)
      .then(({ data }) => !cancelled && setTuition(data))
      .catch(() => !cancelled && setNotFound(true))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading tuition details..." />;

  if (notFound || !tuition) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Tuition not found</h1>
        <p className="mt-2 text-slate-600">
          This post may have been removed or is not available yet.
        </p>
        <Link to="/tuitions" className="btn-brand mt-6 inline-flex">
          Browse Tuitions
        </Link>
      </div>
    );
  }

  const postedOn = tuition.createdAt
    ? new Date(tuition.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Recently";

  // Decide what the Apply area should show
  const renderApplyAction = () => {
    if (authLoading || roleLoading) {
      return (
        <button className="btn-brand w-full" disabled>
          Checking account...
        </button>
      );
    }
    if (!user) {
      return (
        <button
          className="btn-brand w-full"
          onClick={() => navigate("/login", { state: { from: location } })}
        >
          Login to Apply
        </button>
      );
    }
    if (role !== "tutor") {
      return (
        <p className="rounded-lg bg-slate-100 p-3 text-center text-sm text-slate-600">
          Only tutor accounts can apply for tuitions.
        </p>
      );
    }
    if (applied) {
      return (
        <Link to="/dashboard/my-applications" className="btn-brand-outline w-full">
          <MdCheckCircle className="h-5 w-5" /> Application sent, track it
        </Link>
      );
    }
    return (
      <button className="btn-brand w-full" onClick={() => setModalOpen(true)}>
        Apply Now
      </button>
    );
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <Link
        to="/tuitions"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-teal hover:underline"
      >
        <MdArrowBack /> Back to all tuitions
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ------------------------------ Main ------------------------------ */}
        <div className="card-surface p-6 md:p-8 lg:col-span-2">
          <span className="inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
            {tuition.classLevel}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-navy">{tuition.subject}</h1>

          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            <DetailRow Icon={MdLocationOn} label="Location" value={tuition.location} />
            <DetailRow Icon={MdSchool} label="Class" value={tuition.classLevel} />
            <DetailRow
              Icon={MdCalendarMonth}
              label="Schedule"
              value={tuition.daysPerWeek ? `${tuition.daysPerWeek} days / week` : "Flexible"}
            />
            <DetailRow Icon={MdAccessTime} label="Posted on" value={postedOn} />
            <DetailRow
              Icon={MdPerson}
              label="Posted by"
              value={tuition.studentName || "Student"}
            />
          </ul>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-lg font-bold text-navy">Description</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-600">
              {tuition.description || "No additional description provided."}
            </p>
          </div>
        </div>

        {/* ----------------------------- Sidebar ---------------------------- */}
        <aside className="card-surface h-fit space-y-5 p-6 lg:sticky lg:top-24">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Monthly budget</p>
            <p className="text-3xl font-extrabold text-navy">
              ৳{Number(tuition.budget || 0).toLocaleString()}
            </p>
          </div>
          {renderApplyAction()}
        </aside>
      </div>

      {modalOpen && (
        <ApplyTuitionModal
          tuition={tuition}
          onClose={() => setModalOpen(false)}
          onApplied={() => setApplied(true)}
        />
      )}
    </section>
  );
};

export default TuitionDetailsPage;