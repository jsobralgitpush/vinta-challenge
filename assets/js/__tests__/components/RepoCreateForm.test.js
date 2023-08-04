import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import { createStore } from 'redux';
import RepoCreateForm from '../../components/RepoCreateForm';
import rootReducer from '../../reducers/Index';

describe('RepoCreateForm', () => {
  const initialState = {};
  const store = createStore(rootReducer, initialState);
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    HTMLFormElement.prototype.requestSubmit = jest.fn();

    document.getElementById = jest.fn().mockReturnValue({
      dataset: { username: 'testuser' },
    });

    render(
      <Provider store={store}>
        <RepoCreateForm
          handleSubmit={mockHandleSubmit}
          pristine={false}
          submitting={false}
          successMessage={false}
          errorMessage=""
        />
      </Provider>,
    );
  });

  test('renders correctly', () => {
    const repoNameField = screen.getByPlaceholderText('Enter the repository name, must match {user}/{repo}');
    expect(repoNameField).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Submit/ });
    expect(submitButton).toBeInTheDocument();
  });

  test('calls handleSubmit when repository name is valid and form is submitted', () => {
    const repoNameField = screen.getByPlaceholderText('Enter the repository name, must match {user}/{repo}');
    const form = screen.getByTestId('create-repo-form');

    fireEvent.change(repoNameField, { target: { value: '{user}/{validRepoName}' } });
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
