import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { Box, Typography, Paper, Chip, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import MovieIcon from '@mui/icons-material/Movie';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

import { selectChildPoints } from '../../features/points/pointsSlice';
import { selectChildTheme, selectRewardThresholds } from '../../features/settings/settingsSlice';

// Animation pour les transitions fluides
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// Composant autonome pour afficher les récompenses disponibles dans un iframe
const RewardsDisplayPage = () => {
  const { childId } = useParams();
  const baseTheme = useTheme();
  const childTheme = useSelector(state => selectChildTheme(state, childId));
  const points = useSelector(state => selectChildPoints(state, childId));
  const thresholds = useSelector(selectRewardThresholds);

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

  // Vérifier si l'enfant a assez de points pour chaque type de récompense
  const canAfford = {
    small: points.daily >= thresholds.daily,
    medium: points.daily >= thresholds.weekly,
    large: points.daily >= thresholds.monthly,
  };

  // Les différentes récompenses disponibles
  const rewards = [
    {
      type: 'small',
      name: 'Petit écran (30min)',
      points: thresholds.daily,
      icon: <LocalActivityIcon />,
      available: canAfford.small,
    },
    {
      type: 'medium',
      name: 'Film en famille',
      points: thresholds.weekly,
      icon: <MovieIcon />,
      available: canAfford.medium,
    },
    {
      type: 'large',
      name: 'Jeu vidéo (2h)',
      points: thresholds.monthly,
      icon: <SportsEsportsIcon />,
      available: canAfford.large,
    },
  ];

  const handleRewardClick = type => {
    // Rediriger vers la page d'échange de points
    window.parent.location.href = `/actions/redeem-reward/${childId}`;
  };

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
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <EmojiEventsIcon sx={{ mr: 1, color: childTheme.primary }} />
              <Typography variant="subtitle1" fontWeight="medium" color={childTheme.primary}>
                Récompenses • {childId === 'noa' ? 'Noa' : 'Nathan'}
              </Typography>
            </Box>

            <Grid container spacing={1.5}>
              {rewards.map(reward => (
                <Grid item xs={12} key={reward.type}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: `1px solid ${reward.available ? childTheme.primary + '44' : '#e0e0e0'}`,
                      backgroundColor: reward.available ? `${childTheme.primary}11` : '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: reward.available ? 1 : 0.6,
                      cursor: reward.available ? 'pointer' : 'default',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: reward.available ? `${childTheme.primary}22` : '#f5f5f5',
                      },
                    }}
                    onClick={() => reward.available && handleRewardClick(reward.type)}
                  >
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          color: reward.available ? childTheme.primary : 'text.disabled',
                          mr: 1.5,
                        }}
                      >
                        {reward.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color={reward.available ? 'text.primary' : 'text.secondary'}
                      >
                        {reward.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${reward.points} pts`}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        bgcolor: reward.available ? `${childTheme.primary}22` : '#e0e0e0',
                        color: reward.available ? childTheme.primary : 'text.secondary',
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 'auto', pt: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={() => (window.parent.location.href = `/actions/redeem-reward/${childId}`)}
                startIcon={<EmojiEventsIcon />}
                sx={{
                  borderColor: childTheme.primary,
                  color: childTheme.primary,
                  mt: 1,
                }}
              >
                Toutes les récompenses
              </Button>
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </ThemeProvider>
  );
};

export default RewardsDisplayPage;
