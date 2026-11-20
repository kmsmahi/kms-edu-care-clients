import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SectionHeading from "../shared/SectionHeading";
import LoadingSpinner from "../shared/LoadingSpinner";
import TutorCard from "../tutors/TutorCard";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/** Auto-fetches the most recently joined tutors. */
const LatestTutorsSection = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_URL}/tutors/latest`, { params: { limit: 4 } })
      .then(({ data }) => {
        if (!cancelled) setTutors(Array.isArray(data) ? data : []);
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Meet Our Tutors"
          title="Latest Tutors"
          subtitle="Passionate educators ready to help students reach their goals."
        />

        {loading ? (
          <LoadingSpinner label="Loading tutors..." />
        ) : error ? (
          <p className="text-center text-slate-500">
            Could not load tutors right now. Please try again later.
          </p>
        ) : tutors.length === 0 ? (
          <p className="text-center text-slate-500">No tutors available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tutors.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/tutors" className="btn-brand-outline h-12 px-8">
            View All Tutors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestTutorsSection;