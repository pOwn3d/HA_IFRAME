import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, Paper, Typography, TextField, Grid, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login, selectParentCode } from './authSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const parentCode = useSelector(selectParentCode);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleParentLogin = () => {
    if (code === parentCode) {
      dispatch(login('parent'));
      setError('');
    } else {
      setError('Code parental incorrect');
    }
  };

  const handleChildLogin = childId => {
    dispatch(login(childId));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          Système de Points
        </Typography>

        <Box sx={{ width: '100%', mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Vue Enfant
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => handleChildLogin('noa')}
                sx={{
                  bgcolor: '#ff5722',
                  '&:hover': { bgcolor: '#e64a19' },
                  py: 2,
                }}
              >
                Noa
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleChildLogin('nathan')}
                sx={{
                  bgcolor: '#2196f3',
                  '&:hover': { bgcolor: '#1976d2' },
                  py: 2,
                }}
              >
                Nathan
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ width: '100%', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Vue Parent
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Code Parent"
            type="password"
            value={code}
            onChange={e => setCode(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleParentLogin}
          >
            Accès Parent
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginScreen;
