import axios from 'axios';
import {reset} from 'redux-form';
import store from '../store';
import {
  createRepositorySuccess, getCommitsSuccess, createRepositoryError
} from '../actions/CommitActions';

export const getCommits = () => axios.get(`/api/commits/`)
  .then((response) => {
    store.dispatch(getCommitsSuccess({...response.data.results}));
  });

export const createRepository = (values, headers, formDispatch) => axios.post('/api/repositories/', values, {headers})
  .then((response) => {
    store.dispatch(createRepositorySuccess(response.data, true));
    formDispatch(reset('repoCreate'));
  }).catch((error) => {
    const errorMessage = error.response ? error.response.data.error : 'Unexpected error occurred';
    store.dispatch(createRepositoryError(errorMessage));
  });
