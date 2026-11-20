import { Link } from "react-router";
import { MdOutlineWorkHistory, MdSchool } from "react-icons/md";

/**
 * Uniform tutor card. Every avatar is the same 96x96 circle.
 * Expected fields: _id, name, photoUrl, qualifications, experience
 */
const TutorCard = ({ tutor }) => {
  const { _id, name, photoUrl, qualifications, experience } = tutor;

  return (
    <article className="card-surface flex h-full flex-col items-center p-6 text-center transition-shadow hover:shadow-md">
      {/* Equal-size avatar */}
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-teal/20 bg-navy text-3xl font-bold text-white">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          (name || "T").charAt(0).toUpperCase()
        )}
      </div>

      <h3 className="mt-4 line-clamp-1 text-lg font-bold text-navy">{name}</h3>

      <ul className="mt-3 flex-1 space-y-2 text-sm text-slate-600">
        <li className="flex items-center justify-center gap-2">
          <MdSchool className="h-4 w-4 shrink-0 text-teal" />
          <span className="line-clamp-2">{qualifications || "Qualifications not added"}</span>
        </li>
        <li className="flex items-center justify-center gap-2">
          <MdOutlineWorkHistory className="h-4 w-4 shrink-0 text-teal" />
          <span className="line-clamp-1">{experience || "Experience not added"}</span>
        </li>
      </ul>

      <Link to={`/tutors/${_id}`} className="btn-brand-outline btn-sm mt-5 h-10 w-full">
        View Profile
      </Link>
    </article>
  );
};

export default TutorCard;