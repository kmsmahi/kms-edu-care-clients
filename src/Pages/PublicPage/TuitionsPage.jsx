import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../Components/Shared/LoadingSpinner";
import TuitionCard from "../../Components/Tutions/TuitionCard";
import TuitionFiltersBar from "../../Components/Tutions/TuitionFiltersBar";
import PaginationControls from "../../Components/Tutions/PaginationControls";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_SIZE = 9;

const initialFilters = {
  search: "",
  classLevel: "",
  subject: "",
  location: "",
  sort: "date_desc",
};

/** Public catalog of approved tuitions: search, filters, sort, pagination. */
const TuitionsPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [options, setOptions] = useState({ subjects: [], locations: [] });
  const [data, setData] = useState({ tuitions: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const listTopRef = useRef(null);

  // Load dropdown options once (falls back to text inputs if this fails)
  useEffect(() => {
    axios
      .get(`${API_URL}/tuitions/filter-options`)
      .then(({ data }) =>
        setOptions({
          subjects: data?.subjects || [],
          locations: data?.locations || [],
        })
      )
      .catch(() => {});
  }, []);

  // Debounce the search box so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search.trim()), 400);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Fetch whenever any query input changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    axios
      .get(`${API_URL}/tuitions`, {
        params: {
          search: debouncedSearch,
          classLevel: filters.classLevel,
          subject: filters.subject,
          location: filters.location,
          sort: filters.sort,
          page,
          limit: PAGE_SIZE,
        },
      })
      .then(({ data }) => {
        if (cancelled) return;
        setData({
          tuitions: data?.tuitions || [],
          total: data?.total || 0,
          totalPages: data?.totalPages || 1,
        });
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, filters.classLevel, filters.subject, filters.location, filters.sort, page]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // any filter change starts from page 1
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setDebouncedSearch("");
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Page header */}
      <section className="bg-navy py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold md:text-4xl">Browse Tuitions</h1>
          <p className="mt-3 text-slate-300">
            Explore approved tuition requirements and apply to the ones that fit you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10" ref={listTopRef}>
        <TuitionFiltersBar
          filters={filters}
          options={options}
          onChange={handleFilterChange}
          onReset={handleReset}
        />

        <p className="mb-5 mt-6 text-sm text-slate-500">
          {loading ? "Searching..." : `${data.total} tuition${data.total === 1 ? "" : "s"} found`}
        </p>

        {loading ? (
          <LoadingSpinner label="Loading tuitions..." />
        ) : error ? (
          <div className="card-surface p-10 text-center text-slate-500">
            Could not load tuitions. Please try again later.
          </div>
        ) : data.tuitions.length === 0 ? (
          <div className="card-surface p-10 text-center">
            <p className="text-lg font-semibold text-navy">No tuitions match your search</p>
            <p className="mt-1 text-sm text-slate-500">
              Try different keywords or clear your filters.
            </p>
            <button onClick={handleReset} className="btn-brand mt-5">
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.tuitions.map((tuition) => (
                <TuitionCard key={tuition._id} tuition={tuition} />
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

export default TuitionsPage;