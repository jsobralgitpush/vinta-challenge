import React from 'react';
import { render, screen } from '@testing-library/react';
import CommitList from '../../../components/CommitList/index';

const mockData = [
  {
    sha: '123',
    author: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    message: 'Test commit',
    repository: 'Test Repo',
    date: '2023-08-02',
  },
  {
    sha: '456',
    author: 'Jane Doe',
    avatar: 'https://example.com/avatar2.jpg',
    message: 'Another test commit',
    repository: 'Another Test Repo',
    date: '2023-08-03',
  },
];

describe('CommitList', () => {
  it('renders correctly', () => {
    render(<CommitList commits={mockData} />);

    expect(screen.getByText('Commit List')).toBeInTheDocument();
    expect(screen.getByText('Test commit')).toBeInTheDocument();
    expect(screen.getByText('Another test commit')).toBeInTheDocument();

    expect(screen.getByText('John Doe authored on Test Repo at 2023-08-02')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe authored on Another Test Repo at 2023-08-03')).toBeInTheDocument();
  });

  it('does not render when there are no commits', () => {
    render(<CommitList commits={[]} />);
    expect(screen.queryByText('Commit List')).toBeNull();
  });
});