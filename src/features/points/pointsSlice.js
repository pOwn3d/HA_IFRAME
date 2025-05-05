import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  children: {
    noa: {
      points: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        maxDaily: 100,
      },
      lastAchievement: '',
      dailyChallenge: 'Aide à mettre la table ce soir pour gagner 15 points bonus!',
      history: [],
      hasNegative: false,
      totalRewards: 0,
    },
    nathan: {
      points: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        maxDaily: 100,
      },
      lastAchievement: '',
      dailyChallenge: "Range ta chambre aujourd'hui pour gagner 10 points bonus!",
      history: [],
      hasNegative: false,
      totalRewards: 0,
    },
  },
};

export const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    addPoints: (state, action) => {
      const { childId, amount, reason } = action.payload;
      const child = state.children[childId];

      // Add points
      child.points.daily = Math.min(child.points.daily + amount, child.points.maxDaily);
      child.points.weekly += amount;
      child.points.monthly += amount;

      // Record in history
      child.history.push({
        timestamp: new Date().toISOString(),
        action: 'add',
        amount,
        reason,
      });
    },
    removePoints: (state, action) => {
      const { childId, amount, reason } = action.payload;
      const child = state.children[childId];

      // Remove points
      child.points.daily = Math.max(child.points.daily - amount, 0);
      child.points.weekly = Math.max(child.points.weekly - amount, 0);
      child.points.monthly = Math.max(child.points.monthly - amount, 0);

      // Check if went negative
      if (child.points.daily < 0 || child.points.weekly < 0 || child.points.monthly < 0) {
        child.hasNegative = true;
      }

      // Record in history
      child.history.push({
        timestamp: new Date().toISOString(),
        action: 'remove',
        amount,
        reason,
      });
    },
    redeemReward: (state, action) => {
      const { childId, points, rewardName } = action.payload;
      const child = state.children[childId];

      // Remove points
      child.points.daily = Math.max(child.points.daily - points, 0);
      child.points.weekly = Math.max(child.points.weekly - points, 0);
      child.points.monthly = Math.max(child.points.monthly - points, 0);

      // Increment rewards
      child.totalRewards += 1;
      child.lastAchievement = rewardName;

      // Record in history
      child.history.push({
        timestamp: new Date().toISOString(),
        action: 'redeem',
        amount: points,
        reason: rewardName,
      });
    },
    resetDailyPoints: state => {
      Object.values(state.children).forEach(child => {
        child.points.daily = 0;
      });
    },
    resetWeeklyPoints: state => {
      Object.values(state.children).forEach(child => {
        child.points.weekly = 0;
      });
    },
    resetMonthlyPoints: state => {
      Object.values(state.children).forEach(child => {
        child.points.monthly = 0;
      });
    },
    updateDailyChallenge: (state, action) => {
      const { childId, challenge } = action.payload;
      state.children[childId].dailyChallenge = challenge;
    },
    completeChallenge: (state, action) => {
      const { childId, points } = action.payload;
      const child = state.children[childId];

      // Add bonus points
      child.points.daily = Math.min(child.points.daily + points, child.points.maxDaily);
      child.points.weekly += points;
      child.points.monthly += points;

      // Record in history
      child.history.push({
        timestamp: new Date().toISOString(),
        action: 'challenge',
        amount: points,
        reason: 'Défi quotidien complété',
      });

      // Reset challenge
      child.dailyChallenge = '';
    },
  },
});

export const {
  addPoints,
  removePoints,
  redeemReward,
  resetDailyPoints,
  resetWeeklyPoints,
  resetMonthlyPoints,
  updateDailyChallenge,
  completeChallenge,
} = pointsSlice.actions;

export const selectChildPoints = (state, childId) => state.points.children[childId].points;
export const selectChildHistory = (state, childId) => state.points.children[childId].history;
export const selectDailyChallenge = (state, childId) =>
  state.points.children[childId].dailyChallenge;
export const selectLastAchievement = (state, childId) =>
  state.points.children[childId].lastAchievement;
export const selectAllChildren = state => state.points.children;

export default pointsSlice.reducer;
