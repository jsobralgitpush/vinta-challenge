import rootReducer from '../../reducers/Index';

describe('Root Reducer', () => {
  it('should have the correct keys', () => {
    const state = rootReducer({}, {});
    expect(Object.keys(state)).toEqual(['form', 'commitState']);
  });
});
