import { configureStore } from '@reduxjs/toolkit';
import pointsReducer from '../features/points/pointsSlice';
import authReducer from '../features/auth/authSlice';
import settingsReducer from '../features/settings/settingsSlice';
import { loadState, setupLocalStoragePersistence } from './localStorage';

// Charger l'état depuis localStorage s'il existe
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    points: pointsReducer,
    auth: authReducer,
    settings: settingsReducer,
  },
  preloadedState,
});

// Configurer la persistance dans localStorage
setupLocalStoragePersistence(store);
