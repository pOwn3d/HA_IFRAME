import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';

import { completeChallenge, selectDailyChallenge } from '../../features/points/pointsSlice';
import { selectChildTheme } from '../../features/settings/settingsSlice';
import { selectParentCode } from '../../features/auth/authSlice';

// Animation pour les transitions fluides
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// Page autonome pour compléter le défi quotidien
const CompleteChallengeAction = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseTheme = useTheme();
  const childTheme = useSelector(state => selectChildTheme(state, childId));
  const parentCode = useSelector(selectParentCode);
  const challenge = useSelector(state => selectDailyChallenge(state, childId));

  // États pour le formulaire et les étapes
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

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

  // Gérer les étapes
  const handleNext = () => {
    if (activeStep === 0) {
      if (code === parentCode) {
        // Compléter le défi
        dispatch(
          completeChallenge({
            childId,
            points: 15, // Points bonus pour compléter le défi
          })
        );

        // Réinitialiser le formulaire et passer à l'étape suivante
        setError('');
      } else {
        setError('Code parental incorrect');
        return;
      }
    }

    setActiveStep(prevStep => prevStep + 1);
    setError('');
  };

  const handleClose = () => {
    // Referme l'iframe ou redirige vers une autre page
    if (window !== window.parent) {
      // Si nous sommes dans un iframe, tentative de communication avec le parent
      window.parent.postMessage({ type: 'closeModal', success: true }, '*');
    } else {
      // Sinon, rediriger vers la page précédente
      navigate(-1);
    }
  };

  // Étapes du processus
  const steps = ['Validation', 'Confirmation'];

  // Vérifier s'il y a un défi à compléter
  if (!challenge) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            p: 2,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              maxWidth: 400,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <BoltIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Pas de défi à compléter
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Il n'y a actuellement aucun défi quotidien à compléter pour{' '}
              {childId === 'noa' ? 'Noa' : 'Nathan'}.
            </Typography>
            <Button variant="outlined" color="primary" onClick={handleClose} sx={{ mt: 2 }}>
              Retour
            </Button>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  // Contenu en fonction de l'étape active
  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Défi à compléter:
            </Typography>

            <Paper
              sx={{
                p: 2.5,
                my: 2,
                bgcolor: '#fff9c4',
                borderRadius: 2,
                border: '1px solid #fff59d',
              }}
            >
              <Typography variant="body1" fontWeight="medium">
                {challenge}
              </Typography>
            </Paper>

            <Typography variant="body2" sx={{ mb: 2 }}>
              Pour valider que {childId === 'noa' ? 'Noa' : 'Nathan'} a bien complété ce défi,
              veuillez entrer le code parental:
            </Typography>

            <TextField
              margin="normal"
              label="Code parental"
              type="password"
              fullWidth
              value={code}
              onChange={e => setCode(e.target.value)}
              error={!!error}
              helperText={error}
              autoFocus
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 64, color: 'white' }} />
              </Box>
            </motion.div>

            <Typography variant="h5" gutterBottom color="success.main">
              Défi complété !
            </Typography>

            <Box sx={{ mt: 2, p: 3, bgcolor: '#f0f7ff', borderRadius: 2 }}>
              <Typography variant="body1" paragraph>
                {childId === 'noa' ? 'Noa' : 'Nathan'} a complété son défi et a gagné{' '}
                <strong>15 points</strong> !
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                "{challenge}"
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 4 }}>
              <Avatar sx={{ bgcolor: childTheme.primary, mr: 1 }}>
                {childId === 'noa' ? '👧' : '👦'}
              </Avatar>
              <Typography variant="body1">
                Bravo {childId === 'noa' ? 'Noa' : 'Nathan'} !
              </Typography>
            </Box>
          </Box>
        );
      default:
        return 'Étape inconnue';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <motion.div initial="initial" animate="animate" variants={containerVariants}>
        <Box
          sx={{
            p: 2,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box display="flex" alignItems="center" mb={2}>
              <IconButton edge="start" color="inherit" onClick={handleClose} sx={{ mr: 1 }}>
                <CloseIcon />
              </IconButton>
              <Box flex={1} display="flex" alignItems="center">
                <BoltIcon sx={{ color: '#f57c00', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Compléter le défi du jour
                </Typography>
              </Box>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Content */}
            <Box flex={1}>{getStepContent(activeStep)}</Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" color="primary" onClick={handleClose}>
                  Terminer
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext}>
                  Valider le défi
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </ThemeProvider>
  );
};

export default CompleteChallengeAction;
