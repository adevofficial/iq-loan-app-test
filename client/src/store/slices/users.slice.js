import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { get } from 'lodash';
import { requestJsonAPI } from '../../helpers/api.helper';

export const loadList = createAsyncThunk(
  'users/loadList',
  async ({ perPage, page }, thunk) => {
    const state = thunk.getState();

    const filtered = JSON.stringify(get(state, 'users.usersListFilters', []));

    return await requestJsonAPI(thunk, 'GET', 'users', null, {
      filtered,
      perPage,
      page,
    });
  }
);

export const loadPickerList = createAsyncThunk(
  'users/loadPickerList',
  async (data, thunk) => {
    return await requestJsonAPI(thunk, 'GET', 'users/picker', null, {
      picker: '{"label": "name","value": "id"}',
      filtered: `[{"id":"search$name", "value":"${data}"}]`,
    });
  }
);

export const loadUser = createAsyncThunk(
  'users/loadUser',
  async (id, thunk) => {
    return await requestJsonAPI(thunk, 'GET', `users/${id}`);
  }
);
export const createUser = createAsyncThunk(
  'users/create',
  async (data, thunk) => {
    return await requestJsonAPI(thunk, 'POST', 'users', data);
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }, thunk) => {
    return await requestJsonAPI(thunk, 'PUT', `users/${id}`, data);
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, thunk) => {
    return await requestJsonAPI(thunk, 'DELETE', `users/${id}`, null);
  }
);

const users = createSlice({
  name: 'users',
  initialState: {
    user: {},
    usersList: [],
    usersListMeta: { total: 0, page: 0 },

    usersListFilters: [],
    usersPickerList: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.usersListFilters = action.payload;
    },
    clearFilters: (state) => {
      state.usersListFilters = [];
    },
  },
  extraReducers: {
    // loadList
    [loadList.pending]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [loadList.rejected]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [loadList.fulfilled]: (state, action) => ({
      ...state,
      loading: false,
      usersList: action.payload.data,
      usersListMeta: action.payload.meta,
    }),
    // loadList
    [loadPickerList.pending]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [loadPickerList.rejected]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [loadPickerList.fulfilled]: (state, action) => ({
      ...state,
      loading: false,
      usersPickerList: action.payload.data,
    }),

    // loadList
    [loadUser.pending]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [loadUser.rejected]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [loadUser.fulfilled]: (state, action) => ({
      ...state,
      loading: false,
      user: action.payload.data,
    }),
    // createUser
    [createUser.pending]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [createUser.rejected]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [createUser.fulfilled]: (state, action) => ({
      ...state,
      loading: false,
      usersList: [...state.usersList, action.payload.data],
    }),
    // updateUser
    [updateUser.pending]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [updateUser.rejected]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [updateUser.fulfilled]: (state, action) => ({
      ...state,
      loading: false,
      usersList: [
        ...state.usersList.filter(({ id }) => id !== action.payload.data.id),
        action.payload.data,
      ],
    }),
    // deleteUser
    [deleteUser.pending]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [deleteUser.rejected]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [deleteUser.fulfilled]: (state, action) => ({
      ...state,
      loading: false,
      usersList: [
        ...state.usersList.filter(({ id }) => id !== action.payload.data.id),
      ],
    }),
  },
});

export const { clearErrors, setFilters, clearFilters } = users.actions;
export default users.reducer;
