
import * as actions from '../../actions/CommitActions';
import * as types from '../../actions/ActionTypes';

describe('CommitActions', () => {
  it('should create an action to add a repository', () => {
    const mockResponse = { id: 1, name: 'Test Repo' };
    const mockMessage = 'Repo created successfully';
    const expectedAction = {
      type: types.CREATE_REPOSITORY_SUCCESS,
      payload: {response: mockResponse, successMessage: mockMessage},
    }
    expect(actions.createRepositorySuccess(mockResponse, mockMessage)).toEqual(expectedAction);
  });

  it('should create an action to get commits', () => {
    const mockCommits = [{ id: 1, message: 'Test commit' }];
    const expectedAction = {
      type: types.GET_COMMITS_SUCCESS,
      payload: mockCommits,
    }
    expect(actions.getCommitsSuccess(mockCommits)).toEqual(expectedAction);
  });

  it('should create an action for repository creation error', () => {
    const mockMessage = 'Error creating repository';
    const expectedAction = {
      type: types.CREATE_REPOSITORY_ERROR,
      payload: {errorMessage: mockMessage},
    }
    expect(actions.createRepositoryError(mockMessage)).toEqual(expectedAction);
  });
});