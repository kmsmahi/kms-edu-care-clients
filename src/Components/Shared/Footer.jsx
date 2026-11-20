import { Link } from "react-router";
import { FaFacebookF, FaGraduationCap, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Browse Tuitions", to: "/tuitions" },
  { label: "Find Tutors", to: "/tutors" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

// The new X logo (FaXTwitter), not the old Twitter bird
const socials = [
  { label: "Facebook", href: "https://facebook.com", Icon: FaFacebookF },
  { label: "X", href: "https://x.com", Icon: FaXTwitter },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedinIn },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagram },
];

const Footer = () => {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* About */}
        <div className="lg:col-span-2">
          <Link to="/" className="mb-4 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal text-white">
              <FaGraduationCap className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold text-white">
              KMS <span className="text-teal">EduCare</span>
            </span>
          </Link>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            KMS EduCare connects students with verified tutors. Post a tuition
            requirement, review applicants, and pay securely, all in one
            organized platform built for modern learning.
          </p>

          <div className="mt-6 flex gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-teal"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="transition-colors hover:text-teal">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MdLocationOn className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
              Chattogram, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="h-5 w-5 shrink-0 text-teal" />
              +880 1234-567890
            </li>
            <li className="flex items-center gap-2">
              <MdEmail className="h-5 w-5 shrink-0 text-teal" />
              support@kmseducare.com
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-5 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} KMS EduCare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;