import axios from 'axios';
import {reset} from 'redux-form';
import store from '../store';
import {
  createRepositorySuccess, getCommitsSuccess, getReposSuccess, createRepositoryError
} from '../actions/CommitActions';

export const getCommits = (url) => axios.get(url)
  .then((response) => {
    const { results, ...pageData } = response.data;
    store.dispatch(getCommitsSuccess(results, pageData));
  });

export const createRepository = (values, headers, formDispatch) => axios.post('/api/repositories/create/', values, {headers})
  .then((response) => {
    store.dispatch(createRepositorySuccess(response.data, true));
    formDispatch(reset('repoCreate'));
  }).catch((error) => {
    const errorMessage = error.response ? error.response.data.error : 'Unexpected error occurred';
    store.dispatch(createRepositoryError(errorMessage));
  });

export const getRepos = () => axios.get(`/api/repositories/list/`)
  .then((response) => {
    store.dispatch(getReposSuccess({...response.data}));
  });