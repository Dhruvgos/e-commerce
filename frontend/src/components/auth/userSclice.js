// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userProfile: JSON.parse(localStorage.getItem('userProfile')) || null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
      localStorage.setItem('userProfile', JSON.stringify(action.payload));
    },
    clearUserProfile: (state) => {
      state.userProfile = null;
      localStorage.removeItem('userProfile');
    },
  },
});

export const { setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
