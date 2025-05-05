import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { Box, Typography, Paper, Chip, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { selectChildPoints } from '../../features/points/pointsSlice';
import { selectChildTheme } from '../../features/settings/settingsSlice';

// Animation pour les transitions fluides
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// Composant autonome pour afficher les points dans un iframe
const PointsDisplayPage = () => {
  const { childId } = useParams();
  const baseTheme = useTheme();
  const childTheme = useSelector(state => selectChildTheme(state, childId));
  const points = useSelector(state => selectChildPoints(state, childId));

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

  // Calculer le pourcentage de progression
  const progressPercentage = (points.daily / points.maxDaily) * 100;

  return (
    <ThemeProvider theme={theme}>
      <motion.div initial="initial" animate="animate" variants={containerVariants}>
        <Box
          sx={{
            p: 1.5,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: 'transparent',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${childTheme.primary}10, ${childTheme.secondary}15)`,
              border: `2px solid ${childTheme.primary}22`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" color={childTheme.primary} sx={{ fontWeight: 'bold' }}>
                {childId === 'noa' ? '👧 Noa' : '👦 Nathan'}
              </Typography>
              <Chip
                label={`${points.daily} pts`}
                size="medium"
                sx={{
                  bgcolor: childTheme.primary,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                }}
              />
            </Box>

            <Box width="100%" mt={1.5}>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    backgroundColor: childTheme.primary,
                  },
                }}
              />
            </Box>

            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body2" color="text.secondary" fontSize="0.7rem">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary" fontSize="0.7rem">
                {points.maxDaily}
              </Typography>
            </Box>

            <Box mt="auto" display="flex" justifyContent="space-between">
              <Typography variant="body2" fontWeight="medium">
                Semaine: {points.weekly}
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                Mois: {points.monthly}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </ThemeProvider>
  );
};

export default PointsDisplayPage;
