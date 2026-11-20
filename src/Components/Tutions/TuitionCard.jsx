import { Link } from "react-router";
import { MdAccessTime, MdCalendarMonth, MdLocationOn, MdMenuBook, MdSchool } from "react-icons/md";

/**
 * Uniform-height tuition card used on Home and the Tuitions catalog.
 * Expected fields: _id, subject, classLevel, location, budget, daysPerWeek, createdAt
 */
const TuitionCard = ({ tuition }) => {
  const { _id, subject, classLevel, location, budget, daysPerWeek, createdAt } = tuition;

  const postedOn = createdAt
    ? new Date(createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <article className="card-surface flex h-full flex-col p-5 transition-shadow hover:shadow-md">
      {/* Header: icon + subject */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
          <MdMenuBook className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h3 className="line-clamp-1 text-lg font-bold text-navy">{subject}</h3>
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <MdSchool className="h-4 w-4" /> {classLevel}
          </p>
        </div>
      </div>

      {/* Details */}
      <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
        <li className="flex items-center gap-2">
          <MdLocationOn className="h-4 w-4 shrink-0 text-teal" />
          <span className="line-clamp-1">{location}</span>
        </li>
        <li className="flex items-center gap-2">
          <MdCalendarMonth className="h-4 w-4 shrink-0 text-teal" />
          {daysPerWeek ? `${daysPerWeek} days / week` : "Schedule flexible"}
        </li>
        <li className="flex items-center gap-2">
          <MdAccessTime className="h-4 w-4 shrink-0 text-teal" />
          Posted {postedOn}
        </li>
      </ul>

      {/* Footer: budget + action */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Budget</p>
          <p className="text-lg font-extrabold text-navy">
            ৳{Number(budget || 0).toLocaleString()}
            <span className="text-xs font-medium text-slate-500"> /mo</span>
          </p>
        </div>
        <Link to={`/tuitions/${_id}`} className="btn-brand btn-sm h-10">
          View Details
        </Link>
      </div>
    </article>
  );
};

export default TuitionCard;