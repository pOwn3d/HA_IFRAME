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
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
} from '@mui/material';
import { motion } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import MovieIcon from '@mui/icons-material/Movie';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

import { redeemReward } from '../../features/points/pointsSlice';
import { selectChildTheme, selectRewardThresholds } from '../../features/settings/settingsSlice';
import { selectChildPoints } from '../../features/points/pointsSlice';
import { selectParentCode } from '../../features/auth/authSlice';

// Animation pour les transitions fluides
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const cardVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  tap: { scale: 0.98 },
};

// Page autonome pour échanger des points contre des récompenses
const RedeemRewardPage = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const baseTheme = useTheme();
  const childTheme = useSelector(state => selectChildTheme(state, childId));
  const parentCode = useSelector(selectParentCode);
  const thresholds = useSelector(selectRewardThresholds);
  const points = useSelector(state => selectChildPoints(state, childId));

  // États pour le formulaire et les étapes
  const [selectedReward, setSelectedReward] = useState(null);
  const [rewardType, setRewardType] = useState('');
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

  // Les récompenses disponibles
  const rewards = {
    small: [
      {
        id: 's1',
        name: "Temps d'écran (30 min)",
        icon: <LocalActivityIcon />,
        points: thresholds.daily,
      },
      { id: 's2', name: 'Choisir un dessin animé', icon: <MovieIcon />, points: thresholds.daily },
      { id: 's3', name: 'Goûter spécial', icon: <LocalActivityIcon />, points: thresholds.daily },
    ],
    medium: [
      {
        id: 'm1',
        name: "Temps d'écran (1 heure)",
        icon: <LocalActivityIcon />,
        points: thresholds.weekly,
      },
      {
        id: 'm2',
        name: 'Choisir le repas',
        icon: <LocalActivityIcon />,
        points: thresholds.weekly,
      },
      { id: 'm3', name: 'Film en famille', icon: <MovieIcon />, points: thresholds.weekly },
    ],
    large: [
      {
        id: 'l1',
        name: 'Sortie spéciale',
        icon: <DirectionsWalkIcon />,
        points: thresholds.monthly,
      },
      {
        id: 'l2',
        name: 'Jeu vidéo (2 heures)',
        icon: <SportsEsportsIcon />,
        points: thresholds.monthly,
      },
      {
        id: 'l3',
        name: "Invitation d'un(e) ami(e)",
        icon: <LocalActivityIcon />,
        points: thresholds.monthly,
      },
      {
        id: 'l4',
        name: 'Cadeau surprise',
        icon: <LocalActivityIcon />,
        points: thresholds.monthly,
      },
    ],
  };

  // Vérifier si l'enfant a assez de points pour chaque type de récompense
  const canAfford = {
    small: points.daily >= thresholds.daily,
    medium: points.daily >= thresholds.weekly,
    large: points.daily >= thresholds.monthly,
  };

  // Gérer les étapes
  const handleNext = () => {
    if (activeStep === 0 && !rewardType) {
      setError('Veuillez sélectionner un type de récompense');
      return;
    }

    if (activeStep === 1 && !selectedReward) {
      setError('Veuillez sélectionner une récompense');
      return;
    }

    if (activeStep === 2) {
      if (code === parentCode) {
        // Échanger les points contre la récompense
        const reward = rewards[rewardType].find(r => r.id === selectedReward);

        dispatch(
          redeemReward({
            childId,
            points: reward.points,
            rewardName: reward.name,
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
  const steps = ['Type', 'Récompense', 'Validation', 'Confirmation'];

  // Contenu en fonction de l'étape active
  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Sélectionne le type de récompense:
            </Typography>

            <RadioGroup
              aria-label="reward-type"
              name="reward-type"
              value={rewardType}
              onChange={e => setRewardType(e.target.value)}
            >
              <FormControlLabel
                value="small"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1">
                      Petite récompense ({thresholds.daily} points)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {canAfford.small
                        ? `Tu as ${points.daily} points`
                        : `Pas assez de points (il te manque ${thresholds.daily - points.daily} points)`}
                    </Typography>
                  </Box>
                }
                disabled={!canAfford.small}
              />
              <FormControlLabel
                value="medium"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1">
                      Moyenne récompense ({thresholds.weekly} points)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {canAfford.medium
                        ? `Tu as ${points.daily} points`
                        : `Pas assez de points (il te manque ${thresholds.weekly - points.daily} points)`}
                    </Typography>
                  </Box>
                }
                disabled={!canAfford.medium}
              />
              <FormControlLabel
                value="large"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1">
                      Grande récompense ({thresholds.monthly} points)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {canAfford.large
                        ? `Tu as ${points.daily} points`
                        : `Pas assez de points (il te manque ${thresholds.monthly - points.daily} points)`}
                    </Typography>
                  </Box>
                }
                disabled={!canAfford.large}
              />
            </RadioGroup>

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Choisis ta récompense:
            </Typography>

            <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {rewards[rewardType].map(reward => (
                <motion.div key={reward.id} variants={cardVariants} whileTap="tap">
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border:
                        selectedReward === reward.id
                          ? `2px solid ${childTheme.primary}`
                          : '2px solid transparent',
                      bgcolor: selectedReward === reward.id ? `${childTheme.primary}10` : 'white',
                      transition: 'all 0.2s',
                      height: '100%',
                    }}
                    onClick={() => setSelectedReward(reward.id)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ color: childTheme.primary, fontSize: '2rem', mb: 1 }}>
                        {reward.icon}
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight={selectedReward === reward.id ? 'bold' : 'normal'}
                      >
                        {reward.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {reward.points} points
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        );
      case 2:
        const selectedRewardObject = rewards[rewardType].find(r => r.id === selectedReward);
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Tu vas échanger <strong>{selectedRewardObject.points} points</strong> contre:
            </Typography>

            <Paper sx={{ p: 2, my: 2, bgcolor: `${childTheme.primary}10`, borderRadius: 2 }}>
              <Box display="flex" alignItems="center">
                <Box sx={{ mr: 2, color: childTheme.primary, fontSize: '2rem' }}>
                  {selectedRewardObject.icon}
                </Box>
                <Typography variant="h6" fontWeight="medium">
                  {selectedRewardObject.name}
                </Typography>
              </Box>
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
      case 3:
        const confirmedReward = rewards[rewardType].find(r => r.id === selectedReward);
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <EmojiEventsIcon sx={{ fontSize: 80, color: '#ffc107', mb: 2 }} />
            </motion.div>

            <Typography variant="h5" gutterBottom color="secondary">
              Félicitations !
            </Typography>

            <Box sx={{ mt: 2, p: 2, bgcolor: `${childTheme.primary}10`, borderRadius: 2 }}>
              <Typography variant="body1" gutterBottom>
                Tu as échangé <strong>{confirmedReward.points} points</strong> contre:
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                {confirmedReward.name}
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic' }}>
              Montre cette page à tes parents pour réclamer ta récompense !
            </Typography>
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
                <EmojiEventsIcon sx={{ color: childTheme.secondary, mr: 1 }} />
                <Typography variant="h6" component="div">
                  Échanger des points contre une récompense
                </Typography>
              </Box>
            </Box>

            {/* User info */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1,
                mb: 2,
                borderRadius: 2,
                bgcolor: '#f5f5f5',
              }}
            >
              <Typography variant="subtitle1">{childId === 'noa' ? 'Noa' : 'Nathan'}</Typography>
              <Typography variant="subtitle1" fontWeight="bold" color={childTheme.primary}>
                {points.daily} points disponibles
              </Typography>
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
            <Box flex={1} sx={{ overflowY: 'auto' }}>
              {getStepContent(activeStep)}
            </Box>

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
                <Button variant="contained" color="secondary" onClick={handleClose}>
                  Terminer
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNext}
                  disabled={
                    (activeStep === 0 && !rewardType) || (activeStep === 1 && !selectedReward)
                  }
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

export default RedeemRewardPage;
