import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { addPoints, removePoints, redeemReward, completeChallenge } from './pointsSlice';

const PointsActionDialog = ({ open, onClose, action, childId, thresholds }) => {
  const dispatch = useDispatch();

  const getInitialState = () => {
    switch (action) {
      case 'add':
        return { amount: 5, reason: '' };
      case 'remove':
        return { amount: 5, reason: '' };
      case 'redeem':
        return { amount: thresholds.daily, reason: "Temps d'écran (30 min)" };
      case 'challenge':
        return { amount: 15, reason: 'Défi quotidien' };
      default:
        return { amount: 0, reason: '' };
    }
  };

  const [values, setValues] = useState(getInitialState());

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = () => {
    switch (action) {
      case 'add':
        dispatch(
          addPoints({
            childId,
            amount: Number(values.amount),
            reason: values.reason,
          })
        );
        break;
      case 'remove':
        dispatch(
          removePoints({
            childId,
            amount: Number(values.amount),
            reason: values.reason,
          })
        );
        break;
      case 'redeem':
        dispatch(
          redeemReward({
            childId,
            points: Number(values.amount),
            rewardName: values.reason,
          })
        );
        break;
      case 'challenge':
        dispatch(
          completeChallenge({
            childId,
            points: Number(values.amount),
          })
        );
        break;
      default:
        break;
    }
    onClose();
  };

  const getTitle = () => {
    switch (action) {
      case 'add':
        return 'Ajouter des points';
      case 'remove':
        return 'Retirer des points';
      case 'redeem':
        return 'Échanger contre une récompense';
      case 'challenge':
        return 'Compléter le défi du jour';
      default:
        return 'Action';
    }
  };

  const getPointOptions = () => {
    switch (action) {
      case 'add':
        return [5, 10, 15, 20, 25].map(value => (
          <MenuItem key={value} value={value}>
            +{value} points
          </MenuItem>
        ));
      case 'remove':
        return [5, 10, 15, 20].map(value => (
          <MenuItem key={value} value={value}>
            -{value} points
          </MenuItem>
        ));
      case 'redeem':
        return [
          <MenuItem key={thresholds.daily} value={thresholds.daily}>
            Petite récompense ({thresholds.daily} points)
          </MenuItem>,
          <MenuItem key={thresholds.weekly} value={thresholds.weekly}>
            Moyenne récompense ({thresholds.weekly} points)
          </MenuItem>,
          <MenuItem key={thresholds.monthly} value={thresholds.monthly}>
            Grande récompense ({thresholds.monthly} points)
          </MenuItem>,
        ];
      default:
        return null;
    }
  };

  const getRewardOptions = () => {
    const smallRewards = ["Temps d'écran (30 min)", 'Choisir un dessin animé', 'Goûter spécial'];

    const mediumRewards = ["Temps d'écran (1 heure)", 'Choisir le repas', 'Film en famille'];

    const largeRewards = [
      'Sortie spéciale',
      'Jeu vidéo (2 heures)',
      "Invitation d'un(e) ami(e)",
      'Cadeau surprise',
    ];

    switch (Number(values.amount)) {
      case thresholds.daily:
        return smallRewards.map(reward => (
          <MenuItem key={reward} value={reward}>
            {reward}
          </MenuItem>
        ));
      case thresholds.weekly:
        return mediumRewards.map(reward => (
          <MenuItem key={reward} value={reward}>
            {reward}
          </MenuItem>
        ));
      case thresholds.monthly:
        return largeRewards.map(reward => (
          <MenuItem key={reward} value={reward}>
            {reward}
          </MenuItem>
        ));
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {action === 'challenge' ? (
            <Typography variant="body1" gutterBottom>
              Félicitations ! Tu recevras {values.amount} points pour avoir complété ton défi du
              jour.
            </Typography>
          ) : (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel id="points-select-label">Points</InputLabel>
                <Select
                  labelId="points-select-label"
                  value={values.amount}
                  label="Points"
                  onChange={handleChange('amount')}
                >
                  {getPointOptions()}
                </Select>
              </FormControl>

              {action === 'redeem' ? (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="reward-select-label">Récompense</InputLabel>
                  <Select
                    labelId="reward-select-label"
                    value={values.reason}
                    label="Récompense"
                    onChange={handleChange('reason')}
                  >
                    {getRewardOptions()}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  margin="normal"
                  label={action === 'add' ? 'Raison (bonne action)' : 'Raison'}
                  type="text"
                  fullWidth
                  value={values.reason}
                  onChange={handleChange('reason')}
                />
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PointsActionDialog;
