import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  resetTime: '06:00:00',
  rewardThresholds: {
    daily: 30,
    weekly: 100,
    monthly: 300,
  },
  theme: {
    noa: {
      primary: '#ff5722', // Orange/Red
      secondary: '#ff9800',
      background: '#fff9f0',
    },
    nathan: {
      primary: '#2196f3', // Blue
      secondary: '#03a9f4',
      background: '#f0f8ff',
    },
  },
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateResetTime: (state, action) => {
      state.resetTime = action.payload;
    },
    updateRewardThresholds: (state, action) => {
      state.rewardThresholds = {
        ...state.rewardThresholds,
        ...action.payload,
      };
    },
    updateChildTheme: (state, action) => {
      const { childId, theme } = action.payload;
      state.theme[childId] = {
        ...state.theme[childId],
        ...theme,
      };
    },
  },
});

export const {
  updateResetTime,
  updateRewardThresholds,
  updateChildTheme,
} = settingsSlice.actions;

export const selectResetTime = (state) => state.settings.resetTime;
export const selectRewardThresholds = (state) => state.settings.rewardThresholds;
export const selectChildTheme = (state, childId) => state.settings.theme[childId];

export default settingsSlice.reducer;