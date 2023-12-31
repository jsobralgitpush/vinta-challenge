import * as types from '../actions/ActionTypes';

const initialState = {
  commits: [],
  repos: [],
  pageData: {
    count: 0,
    next: null,
    previous: null,
    current: null,
    first: null,
    last: null,
  },
  successMessage: false,
  errorMessage: null,
};

const commitReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_COMMITS_SUCCESS:
      return {
        ...state,
        commits: action.payload.commits,
        pageData: action.payload.pageData,
      };
    case types.CREATE_REPOSITORY_SUCCESS: {
      return { ...state, successMessage: action.payload.successMessage, repos: [...state.repos, action.payload.response] };
    }
    case types.GET_REPOS_SUCCESS: {
      return { ...state, repos: Object.values(action.payload) };
    }
    case types.CREATE_REPOSITORY_ERROR: {
      return { ...state, errorMessage: action.payload.errorMessage };
    }
    default:
      return state;
  }
};

export default commitReducer;
