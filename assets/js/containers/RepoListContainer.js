import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as commitAPI from '../api/CommitAPI';
import RepoList from '../components/RepoList/index';

class RepoListContainer extends React.Component {
  componentDidMount() {
    commitAPI.getRepos();
  }

  render() {
    const { repos } = this.props;
    return (
      <div>
        <RepoList repos={repos} />
      </div>
    );
  }
}

RepoListContainer.propTypes = {
  repos: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (store) => ({
  repos: store.commitState.repos,
});

export default connect(mapStateToProps)(RepoListContainer);
