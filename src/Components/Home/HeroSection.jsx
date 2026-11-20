import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { MdOutlineVerified, MdSearch, MdStarRate } from "react-icons/md";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";

// Animation 1: staggered fade-up entrance for the hero copy
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Animation 2: gently floating stat chips (infinite loop)
const float = (delay = 0) => ({
  animate: { y: [0, -12, 0] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
});

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-surface">
      {/* Decorative brand blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-navy/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:py-24 lg:grid-cols-2">
        {/* ------------------------------ Copy ------------------------------ */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-1.5 text-sm font-semibold text-teal"
          >
            <MdOutlineVerified className="h-4 w-4" /> Trusted tuition marketplace
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-5 text-4xl font-extrabold leading-tight text-navy sm:text-5xl lg:text-6xl"
          >
            Find the right tutor,
            <span className="text-teal"> unlock better grades.</span>
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-xl text-lg text-slate-600">
            Post your tuition requirement, review qualified applicants, and pay
            securely. KMS EduCare makes home and online tuition simple,
            transparent, and reliable.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link to="/tuitions" className="btn-brand h-12 px-6">
              <MdSearch className="h-5 w-5" /> Browse Tuitions
            </Link>
            <Link to="/tutors" className="btn-brand-outline h-12 px-6">
              Find a Tutor
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-slate-600"
          >
            <span className="flex items-center gap-2">
              <MdOutlineVerified className="h-5 w-5 text-teal" /> Admin-verified posts
            </span>
            <span className="flex items-center gap-2">
              <MdOutlineVerified className="h-5 w-5 text-teal" /> Secure Stripe payments
            </span>
          </motion.div>
        </motion.div>

        {/* ----------------------------- Visual ----------------------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          {/* Main navy panel */}
          <div className="rounded-3xl bg-navy p-8 text-white shadow-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal">
              <FaChalkboardTeacher className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-2xl font-bold">Learn with confidence</h3>
            <p className="mt-2 text-sm text-slate-300">
              Compare applicants by qualifications, experience, and expected
              salary before you decide.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-extrabold">500+</p>
                <p className="text-xs text-slate-300">Active tuitions</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-extrabold">200+</p>
                <p className="text-xs text-slate-300">Verified tutors</p>
              </div>
            </div>
          </div>

          {/* Floating chips */}
          <motion.div
            {...float(0)}
            className="absolute -left-4 top-10 hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:flex"
          >
            <FaUserGraduate className="h-5 w-5 text-teal" />
            <span className="text-sm font-semibold text-navy">Student friendly</span>
          </motion.div>

          <motion.div
            {...float(1.2)}
            className="absolute -right-4 bottom-12 hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:flex"
          >
            <MdStarRate className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold text-navy">Top rated tutors</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;