import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RepoList from '../../../components/RepoList/index';
import { getCommits } from '../../../api/CommitAPI';

jest.mock('../../../api/CommitAPI');

const mockData = [
  {
    id: 1,
    name: 'repo-one',
  },
  {
    id: 2,
    name: 'repo-two',
  },
];

describe('RepoList', () => {
  it('renders correctly', () => {
    render(<RepoList repos={mockData} />);

    expect(screen.getByText('repo-one')).toBeInTheDocument();
    expect(screen.getByText('repo-two')).toBeInTheDocument();
  });

  it('handles repository click correctly', () => {
    render(<RepoList repos={mockData} />);

    fireEvent.click(screen.getByText('repo-one'));

    expect(getCommits).toHaveBeenCalledWith('/api/commits/?repository_name=repo-one');
  });
});
