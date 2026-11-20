import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { MdArrowBack, MdEventAvailable, MdOutlineWorkHistory, MdSchool } from "react-icons/md";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/** Public profile of a single tutor (no contact details exposed). */
const TutorProfilePage = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    axios
      .get(`${API_URL}/tutors/${id}`)
      .then(({ data }) => !cancelled && setTutor(data))
      .catch(() => !cancelled && setNotFound(true))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading profile..." />;

  if (notFound || !tutor) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-navy">Tutor not found</h1>
        <p className="mt-2 text-slate-600">This profile is not available.</p>
        <Link to="/tutors" className="btn-brand mt-6 inline-flex">
          Browse Tutors
        </Link>
      </div>
    );
  }

  const joined = tutor.createdAt
    ? new Date(tutor.createdAt).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <Link
        to="/tutors"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-teal hover:underline"
      >
        <MdArrowBack /> Back to all tutors
      </Link>

      <div className="card-surface overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-linear-to-r from-navy to-teal" />

        <div className="px-6 pb-8 md:px-10">
          {/* Equal-size avatar overlapping the banner */}
          <div className="-mt-14 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-navy text-4xl font-bold text-white shadow-md">
            {tutor.photoUrl ? (
              <img
                src={tutor.photoUrl}
                alt={tutor.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              (tutor.name || "T").charAt(0).toUpperCase()
            )}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-navy">{tutor.name}</h1>
          <span className="mt-2 inline-block rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
            Tutor
          </span>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-5">
              <div className="mb-2 flex items-center gap-2 text-teal">
                <MdSchool className="h-5 w-5" />
                <h2 className="font-bold text-navy">Qualifications</h2>
              </div>
              <p className="text-slate-600">
                {tutor.qualifications || "Not provided yet."}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <div className="mb-2 flex items-center gap-2 text-teal">
                <MdOutlineWorkHistory className="h-5 w-5" />
                <h2 className="font-bold text-navy">Experience</h2>
              </div>
              <p className="text-slate-600">{tutor.experience || "Not provided yet."}</p>
            </div>
          </div>

          {joined && (
            <p className="mt-6 flex items-center gap-2 text-sm text-slate-500">
              <MdEventAvailable className="h-4 w-4 text-teal" /> Member since {joined}
            </p>
          )}

          <div className="mt-8 border-t border-slate-100 pt-6">
            <Link to="/tuitions" className="btn-brand">
              Browse open tuitions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorProfilePage;