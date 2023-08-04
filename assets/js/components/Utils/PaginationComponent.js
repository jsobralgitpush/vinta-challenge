import React from 'react';
import { Pagination } from 'react-bootstrap';
import { getCommits } from '../../api/CommitAPI';

function PaginationComponent({ pageData }) {
  if (!pageData.count || pageData.count < 10) {
    return null;
  }

  const items = [];
  let currentPage = 1;
  const getUrlForPage = (baseUrl, pageNum) => {
    const url = new URL(baseUrl);
    url.searchParams.set('page', pageNum);
    return url.toString();
  };

  try {
    currentPage = Number(new URL(pageData.current).searchParams.get('page')) || 1;
  } catch (error) {
    currentPage = 1;
  }

  const countPages = Math.ceil(pageData.count / 10);
  const startIndex = Math.max(currentPage - 2, 1);
  const endIndex = Math.min(startIndex + 4, countPages);

  for (let number = startIndex; number <= endIndex; number++) {
    const isCurrentPage = number === currentPage;
    items.push(
      <Pagination.Item key={number} active={isCurrentPage} onClick={() => getCommits(getUrlForPage(pageData.first, number))}>
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <div className="d-flex justify-content-center">
      <Pagination>
        <Pagination.First onClick={() => getCommits(pageData.first)} />
        <Pagination.Prev onClick={() => getCommits(pageData.previous)} disabled={!pageData.previous} />
        {items}
        <Pagination.Next onClick={() => getCommits(pageData.next)} disabled={!pageData.next} />
        <Pagination.Last onClick={() => getCommits(pageData.last)} />
      </Pagination>
    </div>
  );
}

export default PaginationComponent;
