import { configureStore } from '@reduxjs/toolkit';
import selectionReducer from './selectionSlice';
import { starWarsApi } from '../services/api';

export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    [starWarsApi.reducerPath]: starWarsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(starWarsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
