import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppRoutes from './routes';

// Animation et transitions
import { AnimatePresence } from 'framer-motion';

// Thème global de l'application
const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);

  // Détecter si l'application est intégrée dans un iframe (Home Assistant)
  useEffect(() => {
    const checkIfEmbedded = () => {
      return window !== window.parent;
    };
    setIsEmbedded(checkIfEmbedded());
  }, []);

  // Créer un thème adapté
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3', // Bleu
      },
      secondary: {
        main: '#ff9800', // Orange
      },
      background: {
        default: darkMode ? '#303030' : '#f5f5f5',
        paper: darkMode ? '#424242' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 12, // Coins plus arrondis pour un look moderne
    },
    typography: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      h1: {
        fontWeight: 500,
      },
      h2: {
        fontWeight: 500,
      },
      h3: {
        fontWeight: 500,
      },
      button: {
        textTransform: 'none', // Pas de majuscules sur les boutons
        fontWeight: 500,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
          },
          contained: {
            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 12,
          },
          elevation1: {
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
  });

  // Adaptations pour l'intégration dans Home Assistant
  const containerStyle = isEmbedded ? {
    padding: 0,
    margin: 0,
    height: '100vh',
    overflow: 'auto'
  } : {
    my: 2
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Box sx={containerStyle}>
            <AppRoutes />
          </Box>
        </AnimatePresence>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;