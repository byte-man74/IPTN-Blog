import { ChevronLeft, ChevronRight } from "lucide-react";



export const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange
  }: {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    itemsPerPage: number,
    onPageChange: (page: number) => void
  }) => {
    // Calculate which page numbers to show
    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxPagesToShow = 5;

      // If total pages is less than max pages to show, display all pages
      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Always include first page, last page, current page, and pages around current
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        // Adjust if end page exceeds total pages
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }

        // Add ellipsis indicators
        if (startPage > 1) {
          pageNumbers.unshift(-1); // -1 represents ellipsis before
          pageNumbers.unshift(1); // Always show first page
        }

        if (endPage < totalPages) {
          pageNumbers.push(-2); // -2 represents ellipsis after
          pageNumbers.push(totalPages); // Always show last page
        }
      }

      return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Generate page buttons */}
              {pageNumbers.map((pageNum, index) => {
                if (pageNum === -1 || pageNum === -2) {
                  // Render ellipsis
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => onPageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 ${
                      currentPage === pageNum ? 'bg-primaryGreen text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };
