import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { logout } from '../auth/authSlice';
import {
  selectChildPoints,
  selectDailyChallenge,
  selectLastAchievement,
  selectChildHistory,
} from '../points/pointsSlice';
import { selectChildTheme, selectRewardThresholds } from '../settings/settingsSlice';
import PointsProgress from '../points/PointsProgress';
import ParentCodeDialog from '../auth/ParentCodeDialog';
import PointsActionDialog from '../points/PointsActionDialog';
import HistoryList from '../points/HistoryList';

const ChildView = ({ childId }) => {
  const dispatch = useDispatch();
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
  });

  const handleLogout = () => {
    dispatch(logout());
  };

  const openPointsDialog = action => {
    setDialogAction(action);
    setParentDialogOpen(true);
  };

  const handleParentApproval = () => {
    setPointsDialogOpen(true);
  };

  const handlePointsAction = (amount, reason) => {
    // This will be handled by the PointsActionDialog component
    setPointsDialogOpen(false);
  };

  const formatName = name => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {formatName(childId)}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${childTheme.primary}22, ${childTheme.secondary}22)`,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h5" component="h2">
                    Points de {formatName(childId)}
                  </Typography>
                  <Chip
                    label={`${points.daily} / ${points.maxDaily}`}
                    color="primary"
                    size="large"
                    sx={{ fontSize: '1.2rem', py: 2 }}
                  />
                </Box>

                <PointsProgress
                  value={points.daily}
                  max={points.maxDaily}
                  color={childTheme.primary}
                />

                <Box display="flex" justifyContent="space-around" mt={3}>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<AddCircleIcon />}
                    onClick={() => openPointsDialog('add')}
                    sx={{ borderRadius: 4 }}
                  >
                    Gagner
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<RemoveCircleIcon />}
                    onClick={() => openPointsDialog('remove')}
                    sx={{ borderRadius: 4 }}
                  >
                    Perdre
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<EmojiEventsIcon />}
                    onClick={() => openPointsDialog('redeem')}
                    sx={{ borderRadius: 4 }}
                  >
                    Échanger
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {challenge && (
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Défi du jour
                    </Typography>
                    <Typography variant="body1">{challenge}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => openPointsDialog('challenge')}
                    >
                      J'ai terminé !
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )}

            {lastAchievement && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#fff9c4' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Dernière récompense :
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {lastAchievement}
                  </Typography>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12}>
              <Paper sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Historique récent
                </Typography>
                <HistoryList history={history.slice(-5).reverse()} />
              </Paper>
            </Grid>
          </Grid>
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
    </ThemeProvider>
  );
};

export default ChildView;
