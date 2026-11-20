import { useState } from "react";
import Swal from "sweetalert2";
import { MdEmail, MdLocationOn, MdPhone, MdSend } from "react-icons/md";

const contactInfo = [
  { label: "Address", value: "Chattogram, Bangladesh", Icon: MdLocationOn },
  { label: "Phone", value: "+880 1234-567890", Icon: MdPhone },
  { label: "Email", value: "support@kmseducare.com", Icon: MdEmail },
];

const emptyForm = { name: "", email: "", subject: "", message: "" };

/**
 * Contact page. The spec has no messaging endpoint, so the form is
 * client-side only: it validates, confirms, and resets.
 */
const ContactPage = () => {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await Swal.fire({
      icon: "success",
      title: "Message sent!",
      text: "Thanks for reaching out. We will get back to you soon.",
      confirmButtonColor: "#0F294A",
    });
    setForm(emptyForm);
  };

  return (
    <>
      <section className="bg-navy py-14 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold md:text-4xl">Contact Us</h1>
          <p className="mt-3 text-slate-300">
            Questions, feedback, or need help? We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-5">
        {/* Info cards */}
        <div className="space-y-4 lg:col-span-2">
          {contactInfo.map(({ label, value, Icon }) => (
            <div key={label} className="card-surface flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                <p className="font-semibold text-navy">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-surface space-y-4 p-6 md:p-8 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Your name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input w-full"
                required
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Subject</span>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Message</span>
            <textarea
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="textarea w-full"
              required
            />
          </label>

          <button type="submit" className="btn-brand h-12 px-8">
            <MdSend className="h-5 w-5" /> Send Message
          </button>
        </form>
      </section>
    </>
  );
};

export default ContactPage;