import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  MdAttachMoney,
  MdCalendarMonth,
  MdEmail,
  MdLocationOn,
  MdPerson,
  MdSchool,
} from "react-icons/md";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingSpinner from "../../../Components/Shared/LoadingSpinner";

/** Tuitions where the student has paid and this tutor was approved. */
const OngoingTuitions = () => {
  const axiosSecure = useAxiosSecure();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axiosSecure
      .get("/tutor/ongoing-tuitions")
      .then(({ data }) => !cancelled && setItems(Array.isArray(data) ? data : []))
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [axiosSecure]);

  if (loading) return <LoadingSpinner label="Loading ongoing tuitions..." />;

  if (error)
    return (
      <div className="card-surface p-10 text-center text-slate-500">
        Could not load ongoing tuitions. Please try again later.
      </div>
    );

  if (items.length === 0)
    return (
      <div className="card-surface p-10 text-center">
        <p className="text-lg font-semibold text-navy">No ongoing tuitions yet</p>
        <p className="mt-1 text-sm text-slate-500">
          A tuition appears here once a student accepts you and completes payment.
        </p>
        <Link to="/tuitions" className="btn-brand mt-5 inline-flex">
          Find Tuitions
        </Link>
      </div>
    );

  return (
    <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <article key={item._id} className="card-surface flex h-full flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-navy">
                {item.tuition?.subject || "Tuition"}
              </h3>
              <p className="flex items-center gap-1 text-sm text-slate-500">
                <MdSchool className="h-4 w-4" /> {item.tuition?.classLevel}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Ongoing
            </span>
          </div>

          <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <MdLocationOn className="h-4 w-4 shrink-0 text-teal" />
              {item.tuition?.location || "-"}
            </li>
            <li className="flex items-center gap-2">
              <MdCalendarMonth className="h-4 w-4 shrink-0 text-teal" />
              {item.tuition?.daysPerWeek
                ? `${item.tuition.daysPerWeek} days / week`
                : "Schedule flexible"}
            </li>
            <li className="flex items-center gap-2">
              <MdPerson className="h-4 w-4 shrink-0 text-teal" />
              {item.tuition?.studentName || "Student"}
            </li>
            {item.tuition?.studentEmail && (
              <li className="flex items-center gap-2">
                <MdEmail className="h-4 w-4 shrink-0 text-teal" />
                <span className="truncate">{item.tuition.studentEmail}</span>
              </li>
            )}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="flex items-center gap-1 text-xs uppercase tracking-wide text-slate-500">
              <MdAttachMoney className="h-4 w-4 text-teal" /> Agreed salary
            </span>
            <span className="text-lg font-extrabold text-navy">
              ৳{Number(item.expectedSalary || 0).toLocaleString()}
              <span className="text-xs font-medium text-slate-500"> /mo</span>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
};

export default OngoingTuitions;