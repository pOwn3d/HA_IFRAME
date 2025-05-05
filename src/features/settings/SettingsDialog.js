import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Box,
  Typography,
  Tab,
  Tabs,
  Divider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  selectResetTime,
  selectRewardThresholds,
  selectChildTheme,
  updateResetTime,
  updateRewardThresholds,
  updateChildTheme,
} from './settingsSlice';
import { changeParentCode, selectParentCode } from '../auth/authSlice';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const SettingsDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const resetTime = useSelector(selectResetTime);
  const rewardThresholds = useSelector(selectRewardThresholds);
  const noaTheme = useSelector(state => selectChildTheme(state, 'noa'));
  const nathanTheme = useSelector(state => selectChildTheme(state, 'nathan'));
  const parentCode = useSelector(selectParentCode);

  const [newParentCode, setNewParentCode] = useState(parentCode);
  const [newResetTime, setNewResetTime] = useState(resetTime);
  const [newThresholds, setNewThresholds] = useState({ ...rewardThresholds });
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSave = () => {
    // Update parent code if changed
    if (newParentCode !== parentCode) {
      dispatch(changeParentCode(newParentCode));
    }

    // Update reset time if changed
    if (newResetTime !== resetTime) {
      dispatch(updateResetTime(newResetTime));
    }

    // Update thresholds if changed
    if (JSON.stringify(newThresholds) !== JSON.stringify(rewardThresholds)) {
      dispatch(updateRewardThresholds(newThresholds));
    }

    onClose();
  };

  const handleThresholdChange = key => event => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setNewThresholds({
        ...newThresholds,
        [key]: value,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Paramètres du système</DialogTitle>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Général" />
        <Tab label="Points & Récompenses" />
        <Tab label="Personnalisation" />
      </Tabs>

      <DialogContent>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Code Parental"
                type="password"
                value={newParentCode}
                onChange={e => setNewParentCode(e.target.value)}
                margin="normal"
                helperText="Le code utilisé pour les actions parents"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Heure de réinitialisation"
                type="time"
                value={newResetTime}
                onChange={e => setNewResetTime(e.target.value)}
                margin="normal"
                helperText="Heure de réinitialisation des points quotidiens"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Seuils de points pour les récompenses
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Petite récompense"
                type="number"
                value={newThresholds.daily}
                onChange={handleThresholdChange('daily')}
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">points</InputAdornment>,
                }}
                helperText="Temps d'écran, petit privilège..."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Moyenne récompense"
                type="number"
                value={newThresholds.weekly}
                onChange={handleThresholdChange('weekly')}
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">points</InputAdornment>,
                }}
                helperText="Film en famille, activité spéciale..."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Grande récompense"
                type="number"
                value={newThresholds.monthly}
                onChange={handleThresholdChange('monthly')}
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">points</InputAdornment>,
                }}
                helperText="Sortie, cadeau spécial..."
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="subtitle1" gutterBottom>
            Futures options de personnalisation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cette section permettra de personnaliser les couleurs, thèmes, et options d'affichage
            pour chaque enfant.
          </Typography>
        </TabPanel>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
