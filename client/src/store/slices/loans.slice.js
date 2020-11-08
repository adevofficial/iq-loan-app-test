import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { requestJsonAPI } from '../../helpers/api.helper';

export const loadList = createAsyncThunk(
  'loans/loadList',
  async (data, thunk) => {
    return await requestJsonAPI(thunk, 'GET', 'loans');
  }
);
export const loadLoan = createAsyncThunk(
  'loans/loadLoan',
  async (id, thunk) => {
    return await requestJsonAPI(thunk, 'GET', 'loans', null, { id });
  }
);
export const createLoan = createAsyncThunk(
  'loans/create',
  async (data, thunk) => {
    return await requestJsonAPI(thunk, 'POST', 'loans', data);
  }
);

export const updateLoan = createAsyncThunk(
  'loans/update',
  async ({ id, data }, thunk) => {
    return await requestJsonAPI(thunk, 'PUT', `loans/${id}`, data);
  }
);

export const deleteLoan = createAsyncThunk(
  'loans/delete',
  async (id, thunk) => {
    return await requestJsonAPI(thunk, 'DELETE', `loans/${id}`, null);
  }
);

const loans = createSlice({
  name: 'loans',
  initialState: {
    loan: {},
    loansList: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
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
      loansList: action.payload.data,
    }),
    // loadList
    [loadLoan.pending]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [loadLoan.rejected]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [loadLoan.fulfilled]: (state, action) => ({
      ...state,
      loading: false,
      loan: action.payload.data,
    }),
    // createLoan
    [createLoan.pending]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [createLoan.rejected]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [createLoan.fulfilled]: (state, action) => ({
      ...state,
      loading: false,
      loansList: [...state.loansList, action.payload.data],
    }),
    // updateLoan
    [updateLoan.pending]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [updateLoan.rejected]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [updateLoan.fulfilled]: (state, action) => ({
      ...state,
      loading: false,
      loansList: [
        ...state.loansList.filter(({ id }) => id !== action.payload.data.id),
        action.payload.data,
      ],
    }),
    // deleteLoan
    [deleteLoan.pending]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [deleteLoan.rejected]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [deleteLoan.fulfilled]: (state, action) => ({
      ...state,
      loading: false,
      loansList: [
        ...state.loansList.filter(({ id }) => id !== action.payload.data.id),
      ],
    }),
  },
});

export const { clearErrors } = loans.actions;
export default loans.reducer;