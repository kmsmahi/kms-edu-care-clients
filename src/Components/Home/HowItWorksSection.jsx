import { motion } from "motion/react";
import { MdAssignment, MdPeopleAlt, MdPayments } from "react-icons/md";
import SectionHeading from "../shared/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Post a Tuition",
    description:
      "Share the subject, class, location, and budget. Our admins review and approve your post.",
    Icon: MdAssignment,
  },
  {
    number: "02",
    title: "Review Applicants",
    description:
      "Tutors apply with their qualifications, experience, and expected salary. Accept the best fit.",
    Icon: MdPeopleAlt,
  },
  {
    number: "03",
    title: "Pay & Start Learning",
    description:
      "Confirm with a secure Stripe payment and your tutor is approved to begin right away.",
    Icon: MdPayments,
  },
];

// Animation 3: cards slide up one after another as they scroll into view
const card = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

const HowItWorksSection = () => {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Simple Process"
          title="How It Works"
          subtitle="Get matched with the right tutor in three easy steps."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ number, title, description, Icon }, index) => (
            <motion.div
              key={number}
              custom={index}
              variants={card}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="card-surface relative flex flex-col items-center p-8 text-center"
            >
              <span className="absolute right-5 top-4 text-4xl font-extrabold text-slate-100">
                {number}
              </span>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-white">
                <Icon className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;