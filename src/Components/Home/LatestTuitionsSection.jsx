import { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import SectionHeading from "../Shared/SectionHeading";
import LoadingSpinner from "../Shared/LoadingSpinner";
import TuitionCard from "../Tutions/TuitionCard";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/** Auto-fetches the newest admin-approved tuition posts. */
const LatestTuitionsSection = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`${API_URL}/tuitions/latest`, { params: { limit: 6 } })
      .then(({ data }) => {
        if (!cancelled) setTuitions(Array.isArray(data) ? data : []);
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Fresh Opportunities"
          title="Latest Tuition Posts"
          subtitle="Newly approved tuition requirements from students looking for great tutors."
        />

        {loading ? (
          <LoadingSpinner label="Loading tuitions..." />
        ) : error ? (
          <p className="text-center text-slate-500">
            Could not load tuitions right now. Please try again later.
          </p>
        ) : tuitions.length === 0 ? (
          <p className="text-center text-slate-500">No tuition posts available yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link to="/tuitions" className="btn-brand-outline h-12 px-8">
            View All Tuitions
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestTuitionsSection;