import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { MdFlag, MdRemoveRedEye, MdSecurity, MdSupportAgent, MdVerified } from "react-icons/md";
import SectionHeading from "../../components/shared/SectionHeading";

const values = [
  {
    title: "Trust",
    description: "Admin-moderated posts and transparent application statuses.",
    Icon: MdVerified,
  },
  {
    title: "Security",
    description: "JWT-protected APIs and Stripe-powered payments.",
    Icon: MdSecurity,
  },
  {
    title: "Support",
    description: "A dedicated team that keeps students and tutors connected.",
    Icon: MdSupportAgent,
  },
];

const stats = [
  { value: "500+", label: "Tuition posts" },
  { value: "200+", label: "Verified tutors" },
  { value: "1,000+", label: "Happy students" },
  { value: "3", label: "Role-based dashboards" },
];

const AboutPage = () => {
  return (
    <>
      <section className="bg-navy py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold md:text-4xl">About KMS EduCare</h1>
          <p className="mt-3 text-slate-300">
            Making quality tuition accessible, organized, and trustworthy.
          </p>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Our Mission",
              Icon: MdFlag,
              text: "To connect students with qualified tutors through a simple, transparent process, from posting a requirement to securely confirming a tutor.",
            },
            {
              title: "Our Vision",
              Icon: MdRemoveRedEye,
              text: "A learning ecosystem where every student can find the right guidance and every tutor can build a respected, rewarding career.",
            },
          ].map(({ title, Icon, text }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card-surface p-8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-navy">{title}</h2>
              <p className="mt-2 leading-relaxed text-slate-600">{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="rounded-xl bg-surface p-6 text-center">
              <p className="text-4xl font-extrabold text-teal">{value}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          eyebrow="What We Stand For"
          title="Our Core Values"
          subtitle="The principles behind every feature we build."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ title, description, Icon }) => (
            <div key={title} className="card-surface flex flex-col items-center p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/10 text-teal">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-navy">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/register" className="btn-brand h-12 px-8">
            Join KMS EduCare
          </Link>
        </div>
      </section>
    </>
  );
};

export default AboutPage;