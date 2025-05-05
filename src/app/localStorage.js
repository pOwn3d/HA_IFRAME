// Fonctions pour sauvegarder et charger l'état de l'application depuis localStorage

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('kidsPointsSystem');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('kidsPointsSystem', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

// Fonction pour effacer complètement l'état
export const clearState = () => {
  try {
    localStorage.removeItem('kidsPointsSystem');
  } catch (err) {
    console.error('Error clearing state from localStorage:', err);
  }
};

// Mise à jour du store.js pour utiliser la persistance
// Ceci devrait être importé et utilisé dans store.js
export const setupLocalStoragePersistence = (store) => {
  // Sauvegarder l'état dans localStorage chaque fois qu'il change
  store.subscribe(() => {
    saveState(store.getState());
  });
  
  // Vous pouvez également programmer la réinitialisation quotidienne ici
  const checkDailyReset = () => {
    const state = store.getState();
    const now = new Date();
    const resetTimeStr = state.settings.resetTime || '06:00:00';
    
    // Convertir l'heure de réinitialisation en Date
    const [hours, minutes, seconds] = resetTimeStr.split(':').map(Number);
    const resetTime = new Date();
    resetTime.setHours(hours, minutes, seconds, 0);
    
    // Si l'heure actuelle est après l'heure de réinitialisation, réinitialiser les points quotidiens
    if (now >= resetTime) {
      // Vérifier si la réinitialisation a déjà été effectuée aujourd'hui
      const lastReset = localStorage.getItem('lastDailyReset');
      const today = now.toDateString();
      
      if (lastReset !== today) {
        // Réinitialiser les points quotidiens
        store.dispatch({ type: 'points/resetDailyPoints' });
        localStorage.setItem('lastDailyReset', today);
      }
    }
  };
  
  // Vérifier la réinitialisation quotidienne toutes les heures
  setInterval(checkDailyReset, 3600000); // 1 heure
  // Vérifier également au chargement
  checkDailyReset();
};