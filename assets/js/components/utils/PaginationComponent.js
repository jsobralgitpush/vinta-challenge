import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const getPageNumber = (url) => {
  if (!url) return null;
}

const PaginationComponent = ({ totalItems, currentPage, previousPage, nextPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / 10);  // assuming 10 items per page

  return (
    <Pagination>
      <PaginationItem disabled={!previousPage} style={{ background: !previousPage ? 'white' : 'black' }}>
        <PaginationLink href="#" onClick={() => onPageChange(previousPage)} style={{ color: !previousPage ? 'black' : 'white' }}>
          {getPageNumber(previousPage)}
        </PaginationLink>
      </PaginationItem>

      <PaginationItem active style={{ background: 'black' }}>
        <PaginationLink style={{ color: 'white' }}>
          {currentPage}
        </PaginationLink>
      </PaginationItem>

      <PaginationItem disabled={!nextPage} style={{ background: !nextPage ? 'white' : 'black' }}>
        <PaginationLink href="#" onClick={() => onPageChange(nextPage)} style={{ color: !nextPage ? 'black' : 'white' }}>
          {getPageNumber(nextPage)}
        </PaginationLink>
      </PaginationItem>

      <PaginationItem>
        <PaginationLink href="#" onClick={() => onPageChange(totalPages)} style={{ color: 'black' }}>
          Last
        </PaginationLink>
      </PaginationItem>
    </Pagination>
  );
};

export default PaginationComponent;
