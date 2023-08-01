import React from 'react';
import PropTypes from 'prop-types';

const RepoList = ({ repos }) => (
  <ul>
    {repos.map(repo => (
      <li key={repo.id} style={{ color: 'white' }}>
        {repo.name}
      </li>
    ))}
  </ul>
);

RepoList.propTypes = {
  repos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
};

export default RepoList;
