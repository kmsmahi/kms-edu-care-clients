import { motion } from "motion/react";
import {
  MdAdminPanelSettings,
  MdFilterAlt,
  MdLock,
  MdOutlineVerified,
  MdTimeline,
  MdDashboardCustomize,
} from "react-icons/md";
import SectionHeading from "../shared/SectionHeading";

const features = [
  {
    title: "Verified Tutors",
    description: "Review qualifications and experience before you accept anyone.",
    Icon: MdOutlineVerified,
  },
  {
    title: "Secure Payments",
    description: "Stripe-powered checkout approves a tutor only after payment succeeds.",
    Icon: MdLock,
  },
  {
    title: "Moderated Posts",
    description: "Every tuition post is checked by an admin to keep listings genuine.",
    Icon: MdAdminPanelSettings,
  },
  {
    title: "Smart Search & Filters",
    description: "Find tuitions by subject, class, and location, then sort by budget or date.",
    Icon: MdFilterAlt,
  },
  {
    title: "Transparent Tracking",
    description: "Follow every application from Pending to Approved or Rejected.",
    Icon: MdTimeline,
  },
  {
    title: "Role-based Dashboards",
    description: "Dedicated workspaces for students, tutors, and administrators.",
    Icon: MdDashboardCustomize,
  },
];

const WhyChooseUsSection = () => {
  return (
    <section className="bg-surface py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Our Advantages"
          title="Why Choose Us"
          subtitle="Everything you need to run tuition smoothly, in one trusted platform."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, Icon }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35 }}
              className="card-surface flex gap-4 p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;