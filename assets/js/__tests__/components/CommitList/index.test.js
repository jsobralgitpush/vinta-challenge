import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CommitList from '../../../components/CommitList/index';
import { getCommits } from '../../../api/CommitAPI';

jest.mock('../../../api/CommitAPI');

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

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test Repo')).toBeInTheDocument();

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Another Test Repo')).toBeInTheDocument();
  });

  it('does not render when there are no commits', () => {
    render(<CommitList commits={[]} />);
    expect(screen.queryByText('Commit List')).toBeNull();
  });

  it('handles author click correctly', () => {
    render(<CommitList commits={mockData} />);

    fireEvent.click(screen.getByText('John Doe'));

    expect(getCommits).toHaveBeenCalledWith('/api/commits/?author=John Doe');
  });

  it('handles repository click correctly', () => {
    render(<CommitList commits={mockData} />);

    fireEvent.click(screen.getByText('Test Repo'));

    expect(getCommits).toHaveBeenCalledWith('/api/commits/?repository_name=Test Repo');
  });
});
