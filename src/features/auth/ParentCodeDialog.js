import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { selectParentCode } from './authSlice';

const ParentCodeDialog = ({ open, onClose, onValidCode, title, description }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const correctCode = useSelector(selectParentCode);

  const handleSubmit = () => {
    if (code === correctCode) {
      setError(false);
      setCode('');
      onValidCode();
      onClose();
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setCode('');
    setError(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title || 'Authentification Parent'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description || 'Veuillez entrer le code parental pour continuer.'}
        </DialogContentText>
        <Box
          component="form"
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            label="Code Parental"
            type="password"
            fullWidth
            variant="outlined"
            value={code}
            onChange={e => setCode(e.target.value)}
            error={error}
            helperText={error ? 'Code incorrect' : ''}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParentCodeDialog;
