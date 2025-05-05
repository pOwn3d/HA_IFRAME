import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login, selectParentCode } from '../../features/auth/authSlice';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

// Styles personnalisés
const ChildCard = styled(Card)(({ theme, color }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  background: `linear-gradient(135deg, ${color}22, ${color}44)`,
  border: `2px solid ${color}22`,
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 28px ${color}22`,
  },
}));

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const parentCode = useSelector(selectParentCode);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleParentLogin = () => {
    if (code === parentCode) {
      dispatch(login('parent'));
      setError('');
      navigate('/dashboard');
    } else {
      setError('Code parental incorrect');
    }
  };

  const handleChildLogin = childId => {
    dispatch(login(childId));
    navigate(`/child/${childId}`);
  };

  // Emoji et couleurs pour les cartes enfant
  const children = [
    {
      id: 'noa',
      name: 'Noa',
      emoji: '👧',
      color: '#ff5722',
      description: 'Tableau de points et défis',
    },
    {
      id: 'nathan',
      name: 'Nathan',
      emoji: '👦',
      color: '#2196f3',
      description: 'Tableau de points et défis',
    },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Container component="main" maxWidth="md">
        <Box mt={5} textAlign="center">
          <motion.div variants={itemVariants}>
            <Typography
              component="h1"
              variant="h3"
              gutterBottom
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(45deg, #FF5722, #2196F3)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Système de Points Familial
            </Typography>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Typography variant="h6" color="text.secondary" paragraph>
              Choisis ton profil pour commencer
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4} sx={{ mt: 3, mb: 6 }}>
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <Typography variant="h5" align="center" gutterBottom fontWeight="medium">
                Vue Enfant
              </Typography>
            </motion.div>
          </Grid>

          {children.map(child => (
            <Grid item xs={12} sm={6} key={child.id}>
              <motion.div variants={itemVariants}>
                <ChildCard color={child.color}>
                  <CardContent
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}
                  >
                    <Box
                      sx={{
                        fontSize: '5rem',
                        mb: 2,
                        background: `linear-gradient(45deg, ${child.color}, ${child.color}aa)`,
                        borderRadius: '50%',
                        width: 100,
                        height: 100,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {child.emoji}
                    </Box>
                    <Typography variant="h4" component="div" gutterBottom>
                      {child.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                      {child.description}
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => handleChildLogin(child.id)}
                      sx={{
                        bgcolor: child.color,
                        '&:hover': { bgcolor: `${child.color}dd` },
                        py: 1.5,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                      }}
                    >
                      Voir mes points
                    </Button>
                  </CardContent>
                </ChildCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <motion.div variants={itemVariants}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(to right, #f5f5f5, #e0e0e0)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h2" variant="h5">
                Accès Parents
              </Typography>
            </Box>

            <TextField
              fullWidth
              margin="normal"
              label="Code Parent"
              type="password"
              variant="outlined"
              value={code}
              onChange={e => setCode(e.target.value)}
              error={!!error}
              helperText={error}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  handleParentLogin();
                }
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleParentLogin}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              Tableau de bord Parent
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default LoginPage;
