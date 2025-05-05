import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  TextField
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { logout } from '../auth/authSlice';
import { selectAllChildren } from '../points/pointsSlice';
import ChildCard from './ChildCard';
import SettingsDialog from '../settings/SettingsDialog';
import HistoryList from '../points/HistoryList';

const ParentDashboard = () => {
  const dispatch = useDispatch();
  const children = useSelector(selectAllChildren);
  
  const [currentTab, setCurrentTab] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    noa: '',
    nathan: ''
  });
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const handleChallengeChange = (childId) => (event) => {
    setNewChallenge({
      ...newChallenge,
      [childId]: event.target.value
    });
  };
  
  const tabs = ['Tableau de bord', 'Noa', 'Nathan', 'Historique'];

  const renderContent = () => {
    switch (currentTab) {
      case 0: // Dashboard
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ChildCard childId="noa" data={children.noa} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChildCard childId="nathan" data={children.nathan} />
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Défis quotidiens
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Défi pour Noa"
                      value={newChallenge.noa || children.noa.dailyChallenge}
                      onChange={handleChallengeChange('noa')}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Défi pour Nathan"
                      value={newChallenge.nathan || children.nathan.dailyChallenge}
                      onChange={handleChallengeChange('nathan')}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end">
                      <Button variant="contained" color="primary">
                        Mettre à jour les défis
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );
      case 1: // Noa
        return (
          <Box>
            <ChildCard childId="noa" data={children.noa} detailed />
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Historique de Noa
              </Typography>
              <HistoryList history={children.noa.history.slice(-10).reverse()} />
            </Paper>
          </Box>
        );
      case 2: // Nathan
        return (
          <Box>
            <ChildCard childId="nathan" data={children.nathan} detailed />
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Historique de Nathan
              </Typography>
              <HistoryList history={children.nathan.history.slice(-10).reverse()} />
            </Paper>
          </Box>
        );
      case 3: // History
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Historique de Noa
                </Typography>
                <HistoryList history={children.noa.history.slice(-15).reverse()} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Historique de Nathan
                </Typography>
                <HistoryList history={children.nathan.history.slice(-15).reverse()} />
              </Paper>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Système de Points - Tableau de bord Parent
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
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab} />
          ))}
        </Tabs>
      </AppBar>
      
      <Container sx={{ mt: 4 }}>
        {renderContent()}
      </Container>
      
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </Box>
  );
};

export default ParentDashboard;