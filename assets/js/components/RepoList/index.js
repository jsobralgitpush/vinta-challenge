import React from 'react';
import PropTypes from 'prop-types';
import { getCommits } from '../../api/CommitAPI';

const RepoList = ({ repos }) => {

  const handleRepoClick = (repository) => {
    const url = `/api/commits/?repository_name=${repository}`;
    getCommits(url);
  }

  return (
    <ul>
      {repos.map(repo => (
        <a
          role="button"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            handleRepoClick(repo.name);
          }}
          key={repo.id}
        >
          <li>
            {repo.name}
          </li>
        </a>
      ))}
    </ul>
  )
};

RepoList.propTypes = {
  repos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
};

export default RepoList;
