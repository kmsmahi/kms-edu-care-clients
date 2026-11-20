import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { motion } from "motion/react";
import { MdHome } from "react-icons/md";

/**
 * Router-level error element. Shows a friendly 404 for unknown URLs
 * and a generic message for unexpected runtime errors.
 */
const ErrorPage = () => {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card-surface w-full max-w-lg p-10 text-center"
      >
        <h1 className="text-7xl font-extrabold text-navy">
          {is404 ? "404" : "Oops!"}
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-teal" />

        <h2 className="mt-6 text-2xl font-bold text-navy">
          {is404 ? "Page not found" : "Something went wrong"}
        </h2>
        <p className="mt-2 text-slate-600">
          {is404
            ? "The page you are looking for doesn't exist or has been moved."
            : "An unexpected error occurred. Please try again or head back home."}
        </p>

        <Link to="/" className="btn-brand mt-8 inline-flex">
          <MdHome className="h-5 w-5" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;