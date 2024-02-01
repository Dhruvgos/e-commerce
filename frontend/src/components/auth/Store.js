import authReducer from './Authstore';  // Adjust the path accordingly
import { configureStore } from '@reduxjs/toolkit';
import userSclice from './userSclice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    user:userSclice
  },
});

export default store;
