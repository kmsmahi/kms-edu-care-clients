import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MdSearch } from "react-icons/md";
import LoadingSpinner from "../../components/shared/LoadingSpinner";
import TutorCard from "../../components/tutors/TutorCard";
import PaginationControls from "../../components/tuitions/PaginationControls";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_SIZE = 8;

/** Public directory of tutors with name search and pagination. */
const TutorsPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ tutors: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const listTopRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    axios
      .get(`${API_URL}/tutors`, {
        params: { search: debouncedSearch, page, limit: PAGE_SIZE },
      })
      .then(({ data }) => {
        if (cancelled) return;
        setData({
          tutors: data?.tutors || [],
          total: data?.total || 0,
          totalPages: data?.totalPages || 1,
        });
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, page]);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="bg-navy py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold md:text-4xl">Find a Tutor</h1>
          <p className="mt-3 text-slate-300">
            Meet qualified, passionate educators from across the platform.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10" ref={listTopRef}>
        <div className="card-surface mx-auto mb-8 max-w-xl p-4">
          <label className="input w-full">
            <MdSearch className="h-5 w-5 text-slate-400" />
            <input
              type="search"
              placeholder="Search tutors by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading tutors..." />
        ) : error ? (
          <div className="card-surface p-10 text-center text-slate-500">
            Could not load tutors. Please try again later.
          </div>
        ) : data.tutors.length === 0 ? (
          <div className="card-surface p-10 text-center text-slate-500">
            No tutors found.
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.tutors.map((tutor) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
            </div>
            <PaginationControls
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </>
  );
};

export default TutorsPage;