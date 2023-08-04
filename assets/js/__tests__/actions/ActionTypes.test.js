import * as actionTypes from '../../actions/ActionTypes';

describe('Action types', () => {
  it('should have GET_COMMITS_SUCCESS', () => {
    expect(actionTypes.GET_COMMITS_SUCCESS).toEqual('GET_COMMITS_SUCCESS');
  });

  it('should have CREATE_REPOSITORY_SUCCESS', () => {
    expect(actionTypes.CREATE_REPOSITORY_SUCCESS).toEqual('CREATE_REPO_SUCCESS');
  });

  it('should have CREATE_REPOSITORY_ERROR', () => {
    expect(actionTypes.CREATE_REPOSITORY_ERROR).toEqual('CREATE_REPOSITORY_ERROR');
  });
});
