import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import * as commitAPI from '../api/CommitAPI';
import CommitList from '../components/CommitList';
import PaginationComponent from '../components/Utils/PaginationComponent';

const CommitListContainer = () => {
  const commits = useSelector(state => state.commitState.commits);
  const pageData = useSelector(state => state.commitState.pageData);

  useEffect(() => {
    commitAPI.getCommits('/api/commits/');
  }, []); 

  return (
    <div>
      <CommitList commits={commits} />
      <PaginationComponent pageData={pageData} />
    </div>
  );
}

CommitListContainer.propTypes = {
  commits: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageData: PropTypes.object.isRequired,
};

export default CommitListContainer;
