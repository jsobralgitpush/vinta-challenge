import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import RepoCreateContainer from '../../containers/RepoCreateContainer';


jest.mock('../../api/CommitAPI');

const reducer = (state = { commitState: {} }, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

describe('RepoCreateContainer', () => {
  it('renders correctly', () => {
    const store = createStore(reducer, {
      commitState: {
        successMessage: false,
        errorMessage: '',
      },
    });

    document.getElementById = jest.fn().mockReturnValue({ dataset: { username: 'testuser' } });

    render(
      <Provider store={store}>
        <RepoCreateContainer />
      </Provider>,
    );

    const form = screen.getByTestId('create-repo-form');
    expect(form).toBeInTheDocument();
  });
});