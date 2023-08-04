import React from 'react';
import { render, unmountComponentAtNode } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../../reducers/Index';  
import * as commitAPI from '../../api/CommitAPI';
import CommitListContainer from '../../containers/CommitListContainer';

jest.mock('../../api/CommitAPI');

describe('CommitListContainer', () => {
  let store;
  
  beforeEach(() => {
    store = createStore(reducer, {
      commitState: {
        commits: [
          { id: 1, message: 'First commit', sha: 'a1b2c3' },
          { id: 2, message: 'Second commit', sha: 'd4e5f6' }
        ],
        pageData: {
          count: 2,
          next: 'http://localhost:8000/api/commits/?page=2',
          previous: null,
          current: 'http://localhost:8000/api/commits/',
          first: 'http://localhost:8000/api/commits/?page=1',
          last: 'http://localhost:8000/api/commits/?page=1',
        }
      },
    });
    
    commitAPI.getCommits.mockReset();
  });

  it('calls getCommits on mount', () => {
    commitAPI.getCommits.mockResolvedValue();

    render(
      <Provider store={store}>
        <CommitListContainer />
      </Provider>
    );

    expect(commitAPI.getCommits).toHaveBeenCalledTimes(1);
  });

  it('renders CommitList with commits from store', () => {
    const { getByText } = render(
      <Provider store={store}>
        <CommitListContainer />
      </Provider>
    );

    expect(getByText('First commit')).toBeInTheDocument();
    expect(getByText('Second commit')).toBeInTheDocument();
  });
});
