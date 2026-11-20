import { MdRestartAlt, MdSearch } from "react-icons/md";

// Reused by Components/Dashboard/TuitionFormModal
export const CLASS_LEVELS = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12", "Admission Test", "University",
];

export const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest first" },
  { value: "date_asc", label: "Oldest first" },
  { value: "budget_asc", label: "Budget: low to high" },
  { value: "budget_desc", label: "Budget: high to low" },
];

/**
 * Subject/location render as a dropdown when the API supplied options,
 * otherwise they fall back to a plain text input.
 */
const FilterField = ({ name, value, options, placeholder, onChange }) =>
  options.length > 0 ? (
    <select
      aria-label={placeholder}
      className="select w-full"
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  ) : (
    <input
      type="text"
      aria-label={placeholder}
      className="input w-full"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
    />
  );

/**
 * Search + advanced filters + sort.
 * filters: { search, classLevel, subject, location, sort }
 * options: { subjects: string[], locations: string[] }
 */
const TuitionFiltersBar = ({ filters, options, onChange, onReset }) => {
  const hasActiveFilters =
    filters.search ||
    filters.classLevel ||
    filters.subject ||
    filters.location ||
    filters.sort !== "date_desc";

  return (
    <div className="card-surface p-4 md:p-5">
      {/* Search row */}
      <label className="input w-full">
        <MdSearch className="h-5 w-5 text-slate-400" />
        <input
          type="search"
          placeholder="Search by subject or location..."
          value={filters.search}
          onChange={(e) => onChange("search", e.target.value)}
        />
      </label>

      {/* Filters + sort */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <select
          aria-label="Class"
          className="select w-full"
          value={filters.classLevel}
          onChange={(e) => onChange("classLevel", e.target.value)}
        >
          <option value="">All classes</option>
          {CLASS_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <FilterField
          name="subject"
          value={filters.subject}
          options={options.subjects}
          placeholder="All subjects"
          onChange={onChange}
        />

        <FilterField
          name="location"
          value={filters.location}
          options={options.locations}
          placeholder="All locations"
          onChange={onChange}
        />

        <select
          aria-label="Sort by"
          className="select w-full"
          value={filters.sort}
          onChange={(e) => onChange("sort", e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="btn-brand-outline"
        >
          <MdRestartAlt className="h-5 w-5" /> Reset
        </button>
      </div>
    </div>
  );
};

export default TuitionFiltersBar;