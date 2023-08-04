import React from 'react';
import PropTypes from 'prop-types';
import { getCommits } from '../../api/CommitAPI';

function RepoList({ repos }) {
  const handleRepoClick = (repository) => {
    const url = `/api/commits/?repository_name=${repository}`;
    getCommits(url);
  };

  return (
    <ul>
      {repos.map((repo) => (
        <li key={repo.id}>
          <button
            type="button"
            onClick={() => handleRepoClick(repo.repository)}
            key={repo.id}
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
            {repo.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

RepoList.propTypes = {
  repos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
  ).isRequired,
};

export default RepoList;
