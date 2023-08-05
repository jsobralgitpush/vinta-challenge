import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as commitAPI from '../api/CommitAPI';
import CommitList from '../components/CommitList';
import PaginationComponent from '../components/Utils/PaginationComponent';

const CommitListContainer = ({commits, pageData}) => {
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

const mapStateToProps = (store) => ({
  commits: store.commitState.commits,
  pageData: store.commitState.pageData,
});

export default connect(mapStateToProps)(CommitListContainer);
