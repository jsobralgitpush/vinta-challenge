import * as types from '../actions/ActionTypes';

const initialState = {
  commits: [],
  successMessage: false,
  errorMessage: null,
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
    case types.CREATE_REPOSITORY_ERROR: {
      return {...state, errorMessage: action.payload.errorMessage};
    }
    default:
      return state;
  }
};

export default commitReducer;
