import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Pagination } from 'react-bootstrap';
import { getCommits } from '../../api/CommitAPI';

const PaginationComponent = () => {
  const pageData = useSelector(state => state.pageData);
  
  useEffect(() => {
    getCommits(pageData.first); 
  }, []); 

  let items = [];
  for (let number = 1; number <= pageData.count; number++) {
    const isCurrentPage = number === pageData.current;
    items.push(
      <Pagination.Item key={number} active={isCurrentPage} onClick={() => getCommits(`${pageData.first}&page=${number}`)}>
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div>
      <Pagination>
        <Pagination.First onClick={() => getCommits(pageData.first)} />
        <Pagination.Prev onClick={() => getCommits(pageData.previous)} disabled={!pageData.previous} />
        {items}
        <Pagination.Next onClick={() => getCommits(pageData.next)} disabled={!pageData.next} />
        <Pagination.Last onClick={() => getCommits(pageData.last)} />
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
