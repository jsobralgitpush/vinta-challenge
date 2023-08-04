import React from 'react';
import PropTypes from 'prop-types'
import { getCommits } from '../../api/CommitAPI';

const CommitList = (props) => {
  const {commits} = props;

  const handleAuthorClick = (author) => {
    const url = `/api/commits/?author=${author}`;
    getCommits(url);
  }

  const handleRepoClick = (repo) => {
    const url = `/api/commits/?repository_name=${repo}`;
    getCommits(url);
  }
  return (
    <div>
      {commits.length !== 0 && (
        <div>
          <div className="card card-outline-secondary my-4">
            <div className="card-header">
              Commit List
            </div>

            <div className="card-body">
              {commits.map((commit, index) => (
                <div key={commit.sha}>
                  <div className="avatar">
                    <img alt={commit.author} className="img-author" src={commit.avatar} />
                  </div>
                  <div className="commit-detailms">
                    <p>
                      {commit.message}
                    </p>
                    <small className="text-muted">
                      <a href="javascript:void(0);" onClick={() => handleAuthorClick(commit.author)}>{commit.author}</a>
                      {' '}
                      authored
                      {' '}
                      on
                      {' '}
                      <a href="javascript:void(0);" onClick={() => handleRepoClick(commit.repository)}>{commit.repository}</a>
                      {' '}
                      at
                      {' '}
                      {commit.date}
                    </small>
                    {index !== commits.length - 1 && <hr />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CommitList.propTypes = {
  commits: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CommitList;
