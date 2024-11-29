import { configureStore } from '@reduxjs/toolkit';
import petsReducer from './petSlice';
import userReducer from './userSlice'
import settingsReducer from './settingsSlice'

export const store = configureStore({
  reducer: {
    pet: petsReducer,
    user: userReducer,
    settings: settingsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
