import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages principales
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ChildViewPage from './pages/childView/ChildViewPage';

// Pages d'actions autonomes pour l'intégration dans des iframes
import AddPointsPage from './pages/actions/AddPointsPage';
import RemovePointsPage from './pages/actions/RemovePointsPage';
import RedeemRewardPage from './pages/actions/RedeemRewardPage';
import CompleteChallengeAction from './pages/actions/CompleteChallengeAction';

// Pages autonomes avec interface minimale pour iframes
import PointsDisplayPage from './pages/standalone/PointsDisplayPage';
import ChallengeDisplayPage from './pages/standalone/ChallengeDisplayPage';
import HistoryDisplayPage from './pages/standalone/HistoryDisplayPage';
import RewardsDisplayPage from './pages/standalone/RewardsDisplayPage';

// HOC qui vérifie si l'utilisateur est authentifié
const ProtectedRoute = ({ children }) => {
  // On utilise la fonction isIframe pour vérifier si on est dans un iframe
  // Les iframes ont accès direct sans authentification
  const isIframe = window !== window.parent;
  const isAuthenticated = localStorage.getItem('kidsPointsSystem') !== null;

  if (!isAuthenticated && !isIframe) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes principales avec navigation */}
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/child/:childId"
        element={
          <ProtectedRoute>
            <ChildViewPage />
          </ProtectedRoute>
        }
      />

      {/* Routes d'actions */}
      <Route path="/actions/add-points/:childId" element={<AddPointsPage />} />
      <Route path="/actions/remove-points/:childId" element={<RemovePointsPage />} />
      <Route path="/actions/redeem-reward/:childId" element={<RedeemRewardPage />} />
      <Route path="/actions/complete-challenge/:childId" element={<CompleteChallengeAction />} />

      {/* Pages autonomes pour les iframes */}
      <Route path="/standalone/points/:childId" element={<PointsDisplayPage />} />
      <Route path="/standalone/challenge/:childId" element={<ChallengeDisplayPage />} />
      <Route path="/standalone/history/:childId" element={<HistoryDisplayPage />} />
      <Route path="/standalone/rewards/:childId" element={<RewardsDisplayPage />} />

      {/* Redirection par défaut */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
