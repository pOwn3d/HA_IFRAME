import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  currentUser: null, // 'parent', 'noa', or 'nathan'
  parentCode: '1234',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
    changeParentCode: (state, action) => {
      state.parentCode = action.payload;
    },
  },
});

export const { login, logout, changeParentCode } = authSlice.actions;

export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectCurrentUser = state => state.auth.currentUser;
export const selectParentCode = state => state.auth.parentCode;

export default authSlice.reducer;
