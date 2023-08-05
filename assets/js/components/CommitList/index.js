import React from 'react';
import PropTypes from 'prop-types';
import { getCommits } from '../../api/CommitAPI';

function CommitList(props) {
  const { commits } = props;

  const handleAuthorClick = (author) => {
    const url = `/api/commits/?author=${author}`;
    getCommits(url);
  };

  const handleRepoClick = (repo) => {
    const url = `/api/commits/?repository_name=${repo}`;
    getCommits(url);
  };
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
                <div key={`${commit.sha}`}>
                  <div className="avatar">
                    <img alt={commit.author} className="img-author" src={commit.avatar} />
                  </div>
                  <div className="commit-detailms">
                    <p>
                      {commit.message}
                    </p>
                    <small className="text-muted">
                      <button
                        type="button"
                        onClick={() => handleAuthorClick(commit.author)}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'blue',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          display: 'inline',
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {commit.author}
                      </button>
                      {' '}
                      authored
                      {' '}
                      on
                      {' '}
                      <button
                        type="button"
                        onClick={() => handleRepoClick(commit.repository)}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'blue',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          display: 'inline',
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {commit.repository}
                      </button>
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
}

CommitList.propTypes = {
  commits: PropTypes.arrayOf(
    PropTypes.shape({
      sha: PropTypes.string,
      author: PropTypes.string,
      avatar: PropTypes.string,
      message: PropTypes.string,
      repository: PropTypes.string,
      date: PropTypes.string,
    }),
  ).isRequired,
};

export default CommitList;
