import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  useTheme,
  Chip,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import BoltIcon from '@mui/icons-material/Bolt';
import { logout } from '../../features/auth/authSlice';
import { selectAllChildren, updateDailyChallenge } from '../../features/points/pointsSlice';
import ChildCard from '../../features/dashboard/ChildCard';
import SettingsDialog from '../../features/settings/SettingsDialog';
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

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const children = useSelector(selectAllChildren);

  const [currentTab, setCurrentTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    noa: '',
    nathan: '',
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleChallengeChange = childId => event => {
    setNewChallenge({
      ...newChallenge,
      [childId]: event.target.value,
    });
  };

  const handleUpdateChallenges = () => {
    Object.entries(newChallenge).forEach(([childId, challenge]) => {
      if (challenge && challenge !== children[childId].dailyChallenge) {
        dispatch(updateDailyChallenge({ childId, challenge }));
      }
    });

    // Reset form
    setNewChallenge({
      noa: '',
      nathan: '',
    });
  };

  const tabs = [
    { label: 'Tableau de bord', icon: <DashboardIcon /> },
    { label: 'Noa', icon: <PersonIcon sx={{ color: '#ff5722' }} /> },
    { label: 'Nathan', icon: <PersonIcon sx={{ color: '#2196f3' }} /> },
    { label: 'Historique', icon: <HistoryIcon /> },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 0: // Dashboard
        return (
          <motion.div variants={pageVariants}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <ChildCard childId="noa" data={children.noa} />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <ChildCard childId="nathan" data={children.nathan} />
                </motion.div>
              </Grid>
              <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <Paper sx={{ p: 3, mt: 2, borderRadius: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <BoltIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="h5" component="h2">
                        Défis quotidiens
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ mr: 1 }}>
                            Défi actuel de Noa:
                          </Typography>
                          {children.noa.dailyChallenge && (
                            <Chip
                              label={children.noa.dailyChallenge}
                              size="small"
                              sx={{ bgcolor: '#ff572222', borderRadius: 2 }}
                            />
                          )}
                        </Box>
                        <TextField
                          fullWidth
                          label="Nouveau défi pour Noa"
                          value={newChallenge.noa}
                          onChange={handleChallengeChange('noa')}
                          margin="normal"
                          placeholder="Ex: Ranger sa chambre pour gagner 15 points"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ mr: 1 }}>
                            Défi actuel de Nathan:
                          </Typography>
                          {children.nathan.dailyChallenge && (
                            <Chip
                              label={children.nathan.dailyChallenge}
                              size="small"
                              sx={{ bgcolor: '#2196f322', borderRadius: 2 }}
                            />
                          )}
                        </Box>
                        <TextField
                          fullWidth
                          label="Nouveau défi pour Nathan"
                          value={newChallenge.nathan}
                          onChange={handleChallengeChange('nathan')}
                          margin="normal"
                          placeholder="Ex: Aider à mettre la table pour gagner 10 points"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateChallenges}
                            startIcon={<BoltIcon />}
                          >
                            Mettre à jour les défis
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        );
      case 1: // Noa
        return (
          <motion.div variants={pageVariants}>
            <motion.div variants={itemVariants}>
              <ChildCard childId="noa" data={children.noa} detailed />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Historique de Noa
                </Typography>
                <HistoryList history={children.noa.history.slice(-10).reverse()} />
              </Paper>
            </motion.div>
          </motion.div>
        );
      case 2: // Nathan
        return (
          <motion.div variants={pageVariants}>
            <motion.div variants={itemVariants}>
              <ChildCard childId="nathan" data={children.nathan} detailed />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Historique de Nathan
                </Typography>
                <HistoryList history={children.nathan.history.slice(-10).reverse()} />
              </Paper>
            </motion.div>
          </motion.div>
        );
      case 3: // History
        return (
          <motion.div variants={pageVariants}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PersonIcon sx={{ mr: 1, color: '#ff5722' }} />
                      <Typography variant="h6">Historique de Noa</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <HistoryList history={children.noa.history.slice(-15).reverse()} />
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <PersonIcon sx={{ mr: 1, color: '#2196f3' }} />
                      <Typography variant="h6">Historique de Nathan</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <HistoryList history={children.nathan.history.slice(-15).reverse()} />
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ borderRadius: { sm: '0 0 16px 16px' } }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Tableau de bord Parent
            </Typography>
            <IconButton color="inherit" onClick={() => setSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                py: 1.5,
                fontSize: '0.9rem',
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="start" />
            ))}
          </Tabs>
        </AppBar>

        <Container sx={{ mt: 4, mb: 4 }}>{renderContent()}</Container>

        <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </Box>
    </motion.div>
  );
};

export default DashboardPage;
