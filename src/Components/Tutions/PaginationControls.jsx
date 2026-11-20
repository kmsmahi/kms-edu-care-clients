/** Builds a compact page list like: 1 … 4 5 6 … 12 */
const getPages = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
};

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex justify-center" aria-label="Pagination">
      <div className="join">
        <button
          className="join-item btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          «
        </button>

        {getPages(currentPage, totalPages).map((page, index) =>
          page === "..." ? (
            <button key={`dots-${index}`} className="join-item btn btn-disabled">
              …
            </button>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`join-item btn ${
                page === currentPage
                  ? "border-navy bg-navy text-white hover:bg-navy"
                  : ""
              }`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          className="join-item btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          »
        </button>
      </div>
    </nav>
  );
};

export default PaginationControls;