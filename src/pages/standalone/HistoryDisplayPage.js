import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import HistoryIcon from '@mui/icons-material/History';
import { selectChildHistory } from '../../features/points/pointsSlice';
import { selectChildTheme } from '../../features/settings/settingsSlice';
import HistoryList from '../../features/points/HistoryList';

// Animation pour les transitions fluides
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// Composant autonome pour afficher l'historique dans un iframe
const HistoryDisplayPage = () => {
  const { childId } = useParams();
  const baseTheme = useTheme();
  const childTheme = useSelector(state => selectChildTheme(state, childId));
  const history = useSelector(state => selectChildHistory(state, childId));

  // Créer un thème spécifique pour cet enfant
  const theme = createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      primary: {
        main: childTheme.primary,
      },
      secondary: {
        main: childTheme.secondary,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <motion.div initial="initial" animate="animate" variants={containerVariants}>
        <Box
          sx={{
            p: 1.5,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'transparent',
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${childTheme.primary}05, ${childTheme.secondary}10)`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <HistoryIcon sx={{ mr: 1, color: childTheme.primary }} />
              <Typography variant="subtitle1" fontWeight="medium" color={childTheme.primary}>
                Historique • {childId === 'noa' ? 'Noa' : 'Nathan'}
              </Typography>
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: `${childTheme.primary}33`,
                  borderRadius: '4px',
                },
              }}
            >
              <HistoryList history={history.slice(-6).reverse()} />

              {(!history || history.length === 0) && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ fontStyle: 'italic', mt: 2 }}
                >
                  Pas d'historique disponible
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </ThemeProvider>
  );
};

export default HistoryDisplayPage;
