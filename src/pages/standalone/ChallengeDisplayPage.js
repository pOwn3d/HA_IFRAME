import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { selectDailyChallenge } from '../../features/points/pointsSlice';
import { selectChildTheme } from '../../features/settings/settingsSlice';

// Animation pour les transitions fluides
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// Composant autonome pour afficher le défi du jour dans un iframe
const ChallengeDisplayPage = () => {
  const { childId } = useParams();
  const baseTheme = useTheme();
  const childTheme = useSelector(state => selectChildTheme(state, childId));
  const challenge = useSelector(state => selectDailyChallenge(state, childId));

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

  // Si pas de défi, afficher un message approprié
  if (!challenge) {
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
                border: `1px dashed ${childTheme.primary}33`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ fontStyle: 'italic' }}
              >
                Pas de défi aujourd'hui
              </Typography>
            </Paper>
          </Box>
        </motion.div>
      </ThemeProvider>
    );
  }

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
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              background: `linear-gradient(135deg, #fff9c420, #ffeb3b10)`,
              border: `2px solid #ffc10730`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box display="flex" alignItems="center" mb={1.5}>
              <BoltIcon sx={{ color: '#f57f17', mr: 1 }} />
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                color={childId === 'noa' ? '#e64a19' : '#1565c0'}
              >
                Défi du jour • {childId === 'noa' ? 'Noa' : 'Nathan'}
              </Typography>
            </Box>

            <Box mt={1} flex={1}>
              <Typography variant="body1" fontWeight="medium">
                {challenge}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="small"
              startIcon={<CheckCircleIcon />}
              fullWidth
              color="primary"
              sx={{
                mt: 1.5,
                borderRadius: 2,
                bgcolor: childTheme.primary,
                '&:hover': { bgcolor: `${childTheme.primary}dd` },
              }}
              onClick={() => {
                // On redirige vers la page d'action dédiée
                window.parent.location.href = `/actions/complete-challenge/${childId}`;
              }}
            >
              Terminé !
            </Button>
          </Paper>
        </Box>
      </motion.div>
    </ThemeProvider>
  );
};

export default ChallengeDisplayPage;
