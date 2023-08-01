import axios from 'axios';
import {reset} from 'redux-form';
import store from '../store';
import {
  createRepositorySuccess, getCommitsSuccess, getReposSuccess
} from '../actions/CommitActions';

export const getCommits = () => axios.get(`/api/commits/`)
  .then((response) => {
    store.dispatch(getCommitsSuccess({...response.data}));
  });

export const createRepository = (values, headers, formDispatch) => axios.post('/api/repositories/create/', values, {headers})
  .then((response) => {
    store.dispatch(createRepositorySuccess(response.data, true));
    formDispatch(reset('repoCreate'));
  }).catch((error) => {
    const err = error.response;
    console.log(err);
  });

export const getRepos = () => axios.get(`/api/repositories/list/`)
  .then((response) => {
    store.dispatch(getReposSuccess({...response.data}));
  });