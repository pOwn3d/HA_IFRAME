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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { removePoints } from '../../features/points/pointsSlice';
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

// Page autonome pour retirer des points
const RemovePointsPage = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseTheme = useTheme();
  const childTheme = useSelector(state => selectChildTheme(state, childId));
  const parentCode = useSelector(selectParentCode);

  // États pour le formulaire et les étapes
  const [amount, setAmount] = useState(5);
  const [reason, setReason] = useState('');
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
      error: {
        main: '#f44336',
      },
    },
  });

  // Options de points à retirer
  const pointOptions = [5, 10, 15, 20];

  // Gérer les étapes
  const handleNext = () => {
    if (activeStep === 0 && (!amount || !reason)) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (activeStep === 1) {
      if (code === parentCode) {
        // Retirer les points
        dispatch(
          removePoints({
            childId,
            amount: Number(amount),
            reason,
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

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
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
  const steps = ['Détails', 'Validation', 'Confirmation'];

  // Contenu en fonction de l'étape active
  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="points-select-label">Points à retirer</InputLabel>
              <Select
                labelId="points-select-label"
                value={amount}
                label="Points à retirer"
                onChange={e => setAmount(e.target.value)}
              >
                {pointOptions.map(value => (
                  <MenuItem key={value} value={value}>
                    -{value} points
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              label="Raison"
              placeholder="Exemple: Dispute avec son frère/sa sœur"
              type="text"
              fullWidth
              value={reason}
              onChange={e => setReason(e.target.value)}
              error={error && !reason}
              helperText={error && !reason ? 'Ce champ est requis' : ''}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Vous allez retirer{' '}
              <strong style={{ color: theme.palette.error.main }}>-{amount} points</strong> à{' '}
              {childId === 'noa' ? 'Noa' : 'Nathan'} pour:
            </Typography>
            <Paper sx={{ p: 2, my: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="body1">{reason}</Typography>
            </Paper>

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
      case 2:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            </motion.div>

            <Typography variant="h5" gutterBottom color="success.main">
              Points retirés
            </Typography>

            <Box sx={{ mt: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
              <Typography variant="body1">
                <strong style={{ color: theme.palette.error.main }}>-{amount} points</strong> ont
                été retirés à {childId === 'noa' ? 'Noa' : 'Nathan'} pour:
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>
                {reason}
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
                <RemoveCircleIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h6" component="div">
                  Retirer des points à {childId === 'noa' ? 'Noa' : 'Nathan'}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                disabled={activeStep === 0 || activeStep === steps.length - 1}
                onClick={handleBack}
                startIcon={<ArrowBackIcon />}
              >
                Retour
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button variant="contained" color="primary" onClick={handleClose}>
                  Terminer
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color={activeStep === 0 ? 'error' : 'primary'}
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 2 ? 'Confirmer' : 'Suivant'}
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </motion.div>
    </ThemeProvider>
  );
};

export default RemovePointsPage;
