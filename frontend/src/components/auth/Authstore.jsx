// authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isLogin = true;
    },
    logout: (state) => {
      state.isLogin = false;
    },
  },
});

export const { login ,logout} = authSlice.actions;
export default authSlice.reducer;


// In Redux Toolkit, action creators (`login` and `logout`) are functions that generate action objects with predefined action types ("auth/login" and "auth/logout"). These actions trigger reducers to update the state in a predictable manner within your Redux store.

// The createSlice function from Redux Toolkit is a utility that helps simplify the process of creating Redux slices, which are portions of the Redux store that manage a specific piece of state along with the associated actions and reducers. It's a way to define a reducer, actions, and the initial state in a more concise and convenient manner.

// In this example:

// createReducer takes an initial state (initialState) and an object that defines how the state should be updated in response to different actions.

// The object { LOGIN: (state) => { state.isLogin = true; } } specifies that when the action with type LOGIN is dispatched, it should update the state by setting isLogin to true