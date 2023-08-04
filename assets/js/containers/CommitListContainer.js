import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as commitAPI from '../api/CommitAPI';
import CommitList from '../components/CommitList';
import PaginationComponent from '../components/Utils/PaginationComponent';

class CommitListContainer extends React.Component {
  componentDidMount() {
    commitAPI.getCommits('/api/commits/');
  }

  render() {
    const {commits, pageData} = this.props;
    return (
      <div>
        <CommitList commits={commits} />
        <PaginationComponent pageData={pageData} /> 
      </div>
    );
  }
}

CommitListContainer.propTypes = {
  commits: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageData: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  commits: store.commitState.commits,
  pageData: store.commitState.pageData,
});

export default connect(mapStateToProps)(CommitListContainer);
