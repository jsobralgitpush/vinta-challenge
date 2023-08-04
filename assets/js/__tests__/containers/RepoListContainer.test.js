import React from 'react';
import { render, unmountComponentAtNode } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from '../../reducers/Index';  
import * as commitAPI from '../../api/CommitAPI';
import RepoListContainer from '../../containers/RepoListContainer';

jest.mock('../../api/CommitAPI');

describe('RepoListContainer', () => {
  let store;
  
  beforeEach(() => {
    store = createStore(reducer, {
      commitState: {
        repos: [
          { id: 1, name: 'Repo 1' },
          { id: 2, name: 'Repo 2' }
        ]
      },
    });
    
    commitAPI.getCommits.mockReset();
  });

  it('calls getRepos on mount', () => {
    commitAPI.getRepos.mockResolvedValue();

    render(
      <Provider store={store}>
        <RepoListContainer />
      </Provider>
    );

    expect(commitAPI.getRepos).toHaveBeenCalledTimes(1);
  });

  it('renders RepoList with repos from store', () => {
    const { getByText } = render(
      <Provider store={store}>
        <RepoListContainer />
      </Provider>
    );

    expect(getByText('Repo 1')).toBeInTheDocument();
    expect(getByText('Repo 2')).toBeInTheDocument();
  });
});
