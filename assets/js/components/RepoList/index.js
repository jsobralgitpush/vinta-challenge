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
        <button
          type="button"
          onClick={() => handleRepoClick(repo.repository)}
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
          key={repo.id}
        >
          <li>
            {repo.name}
          </li>
        </button>
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
