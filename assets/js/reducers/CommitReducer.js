import * as types from '../actions/ActionTypes';

const initialState = {
  commits: [],
  repos: [],
  successMessage: false,
};

const commitReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_COMMITS_SUCCESS:
      return {
        ...state,
        commits: Object.values(action.payload),
      };
    case types.CREATE_REPOSITORY_SUCCESS: {
      return {...state, successMessage: action.payload.successMessage};
    }
    case types.GET_REPOS_SUCCESS: {
      return {...state, repos: Object.values(action.payload)};
    }
    default:
      return state;
  }
};

export default commitReducer;
