import * as types from '../../actions/ActionTypes';
import commitReducer from '../../reducers/CommitReducer';

describe('CommitReducer', () => {
  const initialState = {
    commits: [],
    successMessage: false,
    errorMessage: null,
  };

  it('should return the initial state', () => {
    expect(commitReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle GET_COMMITS_SUCCESS', () => {
    const action = {
      type: types.GET_COMMITS_SUCCESS,
      payload: { 'commit1': {}, 'commit2': {} }
    };
    
    const expectedState = {
      ...initialState,
      commits: [action.payload.commit1, action.payload.commit2]
    };

    expect(commitReducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle CREATE_REPOSITORY_SUCCESS', () => {
    const action = {
      type: types.CREATE_REPOSITORY_SUCCESS,
      payload: { successMessage: true }
    };
    
    const expectedState = {
      ...initialState,
      successMessage: true
    };

    expect(commitReducer(undefined, action)).toEqual(expectedState);
  });

  it('should handle CREATE_REPOSITORY_ERROR', () => {
    const action = {
      type: types.CREATE_REPOSITORY_ERROR,
      payload: { errorMessage: 'Error message' }
    };
    
    const expectedState = {
      ...initialState,
      errorMessage: 'Error message'
    };

    expect(commitReducer(undefined, action)).toEqual(expectedState);
  });
});
