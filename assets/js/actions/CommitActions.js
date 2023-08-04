import * as types from './ActionTypes';

export const createRepositorySuccess = (response, successMessage) => ({
  type: types.CREATE_REPOSITORY_SUCCESS,
  payload: { response, successMessage },
});

export const getCommitsSuccess = (commits, pageData) => ({
  type: types.GET_COMMITS_SUCCESS,
  payload: { commits, pageData },
});

export const getReposSuccess = (repos) => ({
  type: types.GET_REPOS_SUCCESS,
  payload: repos,
});

export const createRepositoryError = (errorMessage) => ({
  type: types.CREATE_REPOSITORY_ERROR,
  payload: { errorMessage },
});
