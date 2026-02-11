import { Pagination } from "react-bootstrap";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function PaginationBar({ page, totalPages, onPageChange }) {
  const btnClass = "d-flex align-items-center justify-content-center shadow-sm border-0 bg-light text-primary px-3 py-2";

  const leftHiddenPage = page > 3 && (
    <Pagination.Item
      onClick={() => onPageChange(page - 2)}
      className={`${btnClass} border-primary`}
    >
      {page - 2}
    </Pagination.Item>
  );

  const rightHiddenPage = page < totalPages - 2 && (
    <Pagination.Item
      onClick={() => onPageChange(page + 2)}
      className={`${btnClass} border-primary`}
    >
      {page + 2}
    </Pagination.Item>
  );

  return (
    <div className="d-flex justify-content-center my-4 gap-2">
      <Pagination className="m-0">

        <Pagination.First
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className={`${btnClass} bg-primary text-white`}
        >
          <ChevronsLeft size={14} />
        </Pagination.First>

        <Pagination.Prev
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`${btnClass} bg-primary text-white`}
        >
          <ChevronLeft size={14} />
        </Pagination.Prev>

        {leftHiddenPage}

        {page > 1 && (
          <Pagination.Item
            onClick={() => onPageChange(page - 1)}
            className={`${btnClass} border-primary`}
          >
            {page - 1}
          </Pagination.Item>
        )}

        <Pagination.Item
          active
          className={`${btnClass} bg-primary text-white border-primary`}
        >
          {page}
        </Pagination.Item>

        {page < totalPages && (
          <Pagination.Item
            onClick={() => onPageChange(page + 1)}
            className={`${btnClass} border-primary`}
          >
            {page + 1}
          </Pagination.Item>
        )}

        {rightHiddenPage}

        <Pagination.Next
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`${btnClass} bg-primary text-white`}
        >
          <ChevronRight size={14} />
        </Pagination.Next>

        <Pagination.Last
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className={`${btnClass} bg-primary text-white`}
        >
          <ChevronsRight size={14} />
        </Pagination.Last>
      </Pagination>
    </div>
  );
}
