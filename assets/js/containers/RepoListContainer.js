import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as commitAPI from '../api/CommitAPI';
import RepoList from '../components/RepoList/index';

function RepoListContainer({ repos }) {
  useEffect(() => {
    commitAPI.getRepos();
  }, []);

  return (
    <div>
      <RepoList repos={repos} />
    </div>
  );
}

RepoListContainer.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (store) => ({
  repos: store.commitState.repos,
});

export default connect(mapStateToProps)(RepoListContainer);
