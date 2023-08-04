import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store'; // You'll need to install this with `npm install redux-mock-store`
import PaginationComponent from '../../../components/Utils/PaginationComponent';
import getCommits from '../../../api/CommitAPI';

jest.mock('../../../api/CommitAPI', () => {
  return {
    getCommits: jest.fn(),
  };
});


describe('PaginationComponent', () => {
  const pageData = {
    count: 50,
    current: 'http://localhost:8000/api/commits/',
    first: 'http://localhost:8000/api/commits/?page=1',
    last: 'http://localhost:8000/api/commits/?page=5',
    next: 'http://localhost:8000/api/commits/?page=2',
    previous: null,
    results: [
      { id: 1, message: 'commit 1' },
      { id: 2, message: 'commit 2' },
      { id: 3, message: 'commit 3' },
      { id: 4, message: 'commit 4' },
      { id: 5, message: 'commit 5' },
      { id: 6, message: 'commit 6' },
      { id: 7, message: 'commit 7' },
      { id: 8, message: 'commit 8' },
      { id: 9, message: 'commit 9' },
      { id: 10, message: 'commit 10' }
    ]
  };

  const mockStore = configureMockStore();
  const store = mockStore(pageData);

  const renderWithRedux = (component) => {
    return {
      ...render(<Provider store={store}>{component}</Provider>)
    }
  }

  const getCommits = require('../../../api/CommitAPI').getCommits;

  test('renders pagination items', () => {
    const pageData = {
      count: 100,
      current: 'http://localhost:8000/api/commits?page=5',
    };
    const { getByText } = renderWithRedux(<PaginationComponent pageData={pageData} />);
    
    const currentPage = Number(new URL(pageData.current).searchParams.get('page')) || 1;
    const startIndex = Math.max(currentPage - 2, 1);
    const endIndex = Math.min(startIndex + 4, Math.ceil(pageData.count / 10));
  
    for (let number = startIndex; number <= endIndex; number++) {
      const item = getByText(number.toString());
      expect(item).toBeInTheDocument();
    }
  });

  test('calls getCommits with page url on item click', () => {
    const { getByText } = renderWithRedux(<PaginationComponent pageData={pageData} />);
    const item = getByText('2');
    fireEvent.click(item);
    expect(getCommits).toHaveBeenCalledWith(`${pageData.current}?page=2`);
  });

  test('calls getCommits with page url on First click', () => {
    const { getByText } = renderWithRedux(<PaginationComponent pageData={pageData} />);
    const item = getByText('First');
    fireEvent.click(item);
    expect(getCommits).toHaveBeenCalledWith(`${pageData.first}`);
  });

  test('calls getCommits with page url on Next click', () => {
    const { getByText } = renderWithRedux(<PaginationComponent pageData={pageData} />);
    const item = getByText('Next');
    fireEvent.click(item);
    expect(getCommits).toHaveBeenCalledWith(`${pageData.first}`);
  });

  test('calls getCommits with page url on Last click', () => {
    const { getByText } = renderWithRedux(<PaginationComponent pageData={pageData} />);
    const item = getByText('Last');
    fireEvent.click(item);
    expect(getCommits).toHaveBeenCalledWith(`${pageData.last}`);
  });
});