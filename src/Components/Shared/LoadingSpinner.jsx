/**
 * Brand-teal spinner.
 * fullScreen → centered over the whole viewport (used by route guards).
 */
const LoadingSpinner = ({ fullScreen = false, label = "Loading..." }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <span className="loading loading-spinner loading-lg text-teal"></span>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-surface">
        {spinner}
      </div>
    );
  }

  return <div className="flex w-full justify-center py-16">{spinner}</div>;
};

export default LoadingSpinner;