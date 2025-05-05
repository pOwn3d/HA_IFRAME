import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  Avatar,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { logout } from '../../features/auth/authSlice';
import {
  selectChildPoints,
  selectDailyChallenge,
  selectLastAchievement,
  selectChildHistory,
} from '../../features/points/pointsSlice';
import { selectChildTheme, selectRewardThresholds } from '../../features/settings/settingsSlice';
import PointsProgress from '../../features/points/PointsProgress';
import ParentCodeDialog from '../../features/auth/ParentCodeDialog';
import PointsActionDialog from '../../features/points/PointsActionDialog';
import HistoryList from '../../features/points/HistoryList';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut', // Utiliser un préréglage au lieu d'une courbe de Bézier personnalisée
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const ChildViewPage = () => {
  const { childId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseTheme = useTheme();
  const childTheme = useSelector(state => selectChildTheme(state, childId));
  const points = useSelector(state => selectChildPoints(state, childId));
  const challenge = useSelector(state => selectDailyChallenge(state, childId));
  const lastAchievement = useSelector(state => selectLastAchievement(state, childId));
  const history = useSelector(state => selectChildHistory(state, childId));
  const thresholds = useSelector(selectRewardThresholds);

  const [parentDialogOpen, setParentDialogOpen] = useState(false);
  const [pointsDialogOpen, setPointsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);

  // Create a theme for this specific child
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
      background: {
        default: childTheme.background,
        paper: '#ffffff',
      },
    },
    components: {
      ...baseTheme.components,
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: childTheme.primary,
          },
        },
      },
    },
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const openPointsDialog = action => {
    setDialogAction(action);
    setParentDialogOpen(true);
  };

  const handleParentApproval = () => {
    setPointsDialogOpen(true);
  };

  const handlePointsAction = () => {
    setPointsDialogOpen(false);
  };

  const formatName = name => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <ThemeProvider theme={theme}>
      <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ borderRadius: { sm: '0 0 16px 16px' } }}>
            <Toolbar>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: 'white',
                    color: childTheme.primary,
                    width: 36,
                    height: 36,
                    mr: 1.5,
                  }}
                >
                  {childId === 'noa' ? '👧' : '👦'}
                </Avatar>
                <Typography variant="h6" component="div">
                  {formatName(childId)}
                </Typography>
              </Box>
              <Chip
                label={`${points.daily} points`}
                color="secondary"
                sx={{ fontWeight: 'bold', mr: 2 }}
              />
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <Container maxWidth="sm" sx={{ mt: 3, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: `linear-gradient(45deg, ${childTheme.primary}15, ${childTheme.secondary}15)`,
                      border: `2px solid ${childTheme.primary}22`,
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="h5" fontWeight="medium" color={childTheme.primary}>
                        Mes Points
                      </Typography>
                      <Chip
                        label={`${points.daily} / ${points.maxDaily}`}
                        color="primary"
                        size="large"
                        sx={{ fontSize: '1.1rem', py: 2, px: 1, fontWeight: 'bold' }}
                      />
                    </Box>

                    <PointsProgress
                      value={points.daily}
                      max={points.maxDaily}
                      color={childTheme.primary}
                    />

                    <Box display="flex" justifyContent="space-between" mt={2} mb={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Points aujourd'hui
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Points cette semaine: {points.weekly}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box display="flex" justifyContent="space-around" mt={3}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<AddCircleIcon />}
                        onClick={() => openPointsDialog('add')}
                        sx={{ borderRadius: '24px', py: 1.2, px: 3 }}
                      >
                        Gagner
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<RemoveCircleIcon />}
                        onClick={() => openPointsDialog('remove')}
                        sx={{ borderRadius: '24px', py: 1.2, px: 3 }}
                      >
                        Perdre
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<EmojiEventsIcon />}
                        onClick={() => openPointsDialog('redeem')}
                        sx={{ borderRadius: '24px', py: 1.2, px: 3 }}
                      >
                        Échanger
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {challenge && (
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                          <StarIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
                          <Typography variant="h6">Défi du jour</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium' }}>
                          {challenge}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="large"
                          color="primary"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => openPointsDialog('challenge')}
                          fullWidth
                          variant="contained"
                          sx={{ m: 1, borderRadius: 2 }}
                        >
                          J'ai terminé !
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              )}

              {lastAchievement && (
                <Grid item xs={12}>
                  <motion.div variants={itemVariants}>
                    <Paper
                      sx={{
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: '#fff9c4',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <EmojiEventsIcon sx={{ mr: 1, color: '#f57c00' }} />
                        <Typography variant="subtitle1" fontWeight="medium">
                          Dernière récompense :
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold" mt={1}>
                        {lastAchievement}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              )}

              <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <Paper
                    sx={{ p: 3, mt: 1, borderRadius: 3, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Historique récent
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <HistoryList history={history.slice(-5).reverse()} />
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>

            <Box mt={4} display="flex" justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/login')}
                sx={{ borderRadius: 28 }}
              >
                Retour à l'accueil
              </Button>
            </Box>
          </Container>

          <ParentCodeDialog
            open={parentDialogOpen}
            onClose={() => setParentDialogOpen(false)}
            onValidCode={handleParentApproval}
            title="Permission Parentale"
            description="Demande à un parent de valider cette action."
          />

          <PointsActionDialog
            open={pointsDialogOpen}
            onClose={() => setPointsDialogOpen(false)}
            action={dialogAction}
            childId={childId}
            onSubmit={handlePointsAction}
            thresholds={thresholds}
          />
        </Box>
      </motion.div>
    </ThemeProvider>
  );
};

export default ChildViewPage;
