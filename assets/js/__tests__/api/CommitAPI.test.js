import axios from 'axios';
import { reset } from 'redux-form';
import { createRepository, getCommits } from '../../api/CommitAPI';
import { createRepositorySuccess, getCommitsSuccess, createRepositoryError } from '../../actions/CommitActions';
import store from '../../store';

jest.mock('axios');
jest.mock('redux-form');
jest.mock('../../store');
jest.mock('../../actions/CommitActions');
jest.mock('redux-form', () => ({
  reducer: () => ({ mock: 'mockForm' }),
  reset: jest.fn(),
}));

describe('Commit test', () => {
  afterEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
  });

  it('getCommits should dispatch success action', async () => {
    const mockResponse = { data: { someData: 'data' } };
    axios.get.mockResolvedValue(mockResponse);

    await getCommits('/api/commits/');

    expect(axios.get).toHaveBeenCalledWith('/api/commits/');
    expect(store.dispatch).toHaveBeenCalledWith(getCommitsSuccess({ ...mockResponse.data }));
  });

  it('createRepository should dispatch success action and reset form', async () => {
    const mockResponse = { data: { someData: 'data' } };
    const mockValues = { repo: 'test' };
    const mockHeaders = { Authorization: 'Bearer token' };

    axios.post.mockResolvedValue(mockResponse);

    await createRepository(mockValues, mockHeaders, jest.fn());

    expect(axios.post).toHaveBeenCalledWith('/api/repositories/create/', mockValues, { headers: mockHeaders });
    expect(store.dispatch).toHaveBeenCalledWith(createRepositorySuccess(mockResponse.data, true));
    expect(reset).toHaveBeenCalledWith('repoCreate');
  });

  it('createRepository should dispatch error action when request fails', async () => {
    const mockError = { response: { data: { error: 'Some error' } } };
    const mockValues = { repo: 'test' };
    const mockHeaders = { Authorization: 'Bearer token' };

    axios.post.mockRejectedValue(mockError);

    await createRepository(mockValues, mockHeaders, jest.fn());

    expect(axios.post).toHaveBeenCalledWith('/api/repositories/create/', mockValues, { headers: mockHeaders });
    expect(store.dispatch).toHaveBeenCalledWith(createRepositoryError(mockError.response.data.error));
  });
});
