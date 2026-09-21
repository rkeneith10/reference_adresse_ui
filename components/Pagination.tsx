import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export interface PaginationProps {
  currentPage: number; // 0-indexed
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}

/**
 * Calculates the visible page list with ellipses
 * based on current page and total pages.
 */
export function getPaginationRange(
  currentPage: number, // 0-indexed
  totalPages: number
): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  // Near the beginning: 0, 1, 2, ..., totalPages - 1
  if (currentPage <= 2) {
    return [0, 1, 2, "ellipsis-end", totalPages - 1];
  }

  // Near the end: 0, ..., totalPages - 3, totalPages - 2, totalPages - 1
  if (currentPage >= totalPages - 3) {
    return [0, "ellipsis-start", totalPages - 3, totalPages - 2, totalPages - 1];
  }

  // In the middle: 0, ..., currentPage - 1, currentPage, currentPage + 1, ..., totalPages - 1
  return [
    0,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages - 1,
  ];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  previousLabel = "Precedent",
  nextLabel = "Suivant",
  className = "",
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // If there are no items or only 1 page, we still render cleanly or disable controls
  const isFirstPage = currentPage <= 0;
  const isLastPage = totalPages === 0 || currentPage >= totalPages - 1;

  if (totalPages <= 0) {
    return null;
  }

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 my-4 select-none ${className}`}>
      {/* Helper text */}
      <div className="text-xs text-gray-500 font-medium">
        {totalItems > 0 ? (
          <>
            Affichage de{" "}
            <span className="font-semibold text-gray-700">
              {currentPage * itemsPerPage + 1}
            </span>{" "}
            à{" "}
            <span className="font-semibold text-gray-700">
              {Math.min((currentPage + 1) * itemsPerPage, totalItems)}
            </span>{" "}
            sur{" "}
            <span className="font-semibold text-gray-700">{totalItems}</span> entrées
          </>
        ) : (
          "0 entrée"
        )}
      </div>

      {/* Sleek gray pagination bar matching the design */}
      <nav
        aria-label="Pagination"
        className="inline-flex items-center gap-1.5 sm:gap-2 bg-gray-100 text-gray-700 px-3.5 py-1.5 rounded-xl shadow-sm border border-gray-200 text-sm font-medium"
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(0, currentPage - 1))}
          disabled={isFirstPage}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ${
            isFirstPage
              ? "text-gray-400 opacity-40 cursor-not-allowed"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 active:scale-95 cursor-pointer"
          }`}
          aria-label={previousLabel}
        >
          <FaChevronLeft className="w-2.5 h-2.5" />
          <span className="text-xs sm:text-sm font-medium tracking-tight">{previousLabel}</span>
        </button>

        {/* Page numbers and ellipses */}
        <div className="flex items-center gap-1">
          {paginationRange.map((item, idx) => {
            if (item === "ellipsis-start" || item === "ellipsis-end") {
              return (
                <span
                  key={`${item}-${idx}`}
                  className="w-7 h-7 flex items-center justify-center text-gray-400 font-bold tracking-widest text-xs select-none"
                >
                  &hellip;
                </span>
              );
            }

            const pageIndex = item as number;
            const isActive = pageIndex === currentPage;

            return (
              <button
                key={pageIndex}
                type="button"
                onClick={() => onPageChange(pageIndex)}
                aria-current={isActive ? "page" : undefined}
                className={`min-w-[2rem] h-8 px-2 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white text-gray-900 border border-gray-300 shadow-sm font-semibold ring-1 ring-black/5"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/80 active:scale-95 cursor-pointer"
                }`}
              >
                {pageIndex + 1}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
          disabled={isLastPage}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-150 ${
            isLastPage
              ? "text-gray-400 opacity-40 cursor-not-allowed"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 active:scale-95 cursor-pointer"
          }`}
          aria-label={nextLabel}
        >
          <span className="text-xs sm:text-sm font-medium tracking-tight">{nextLabel}</span>
          <FaChevronRight className="w-2.5 h-2.5" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
