import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../context/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
});