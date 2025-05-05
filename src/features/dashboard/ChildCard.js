import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Divider
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { selectChildTheme } from '../settings/settingsSlice';
import PointsProgress from '../points/PointsProgress';
import PointsActionDialog from '../points/PointsActionDialog';
import { selectRewardThresholds } from '../settings/settingsSlice';

const ChildCard = ({ childId, data, detailed = false }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => selectChildTheme(state, childId));
  const thresholds = useSelector(selectRewardThresholds);
  
  const [pointsDialogOpen, setPointsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  
  const handleOpenPointsDialog = (action) => {
    setDialogAction(action);
    setPointsDialogOpen(true);
  };
  
  const formatName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <>
      <Card 
        sx={{ 
          borderRadius: 2, 
          boxShadow: 3,
          background: `linear-gradient(45deg, ${theme.primary}22, ${theme.secondary}22)`,
          border: `1px solid ${theme.primary}44`
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h2" color={theme.primary}>
              {formatName(childId)}
            </Typography>
            <Chip 
              label={`${data.points.daily} points`} 
              sx={{ 
                backgroundColor: theme.primary, 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem'
              }} 
            />
          </Box>
          
          <PointsProgress 
            value={data.points.daily} 
            max={data.points.maxDaily}
            color={theme.primary}
          />
          
          {detailed && (
            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Aujourd'hui
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {data.points.daily}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Cette semaine
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {data.points.weekly}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      Ce mois
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {data.points.monthly}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {data.dailyChallenge && (
            <Box mt={2} p={1.5} bgcolor="#fff9c4" borderRadius={1}>
              <Typography variant="subtitle2" gutterBottom>
                Défi du jour :
              </Typography>
              <Typography variant="body2">
                {data.dailyChallenge}
              </Typography>
            </Box>
          )}
        </CardContent>
        
        <Divider />
        
        <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button 
            size="small" 
            variant="outlined"
            startIcon={<AddCircleIcon />}
            onClick={() => handleOpenPointsDialog('add')}
            sx={{ borderColor: theme.primary, color: theme.primary }}
          >
            Ajouter
          </Button>
          <Button 
            size="small" 
            variant="outlined"
            startIcon={<RemoveCircleIcon />}
            onClick={() => handleOpenPointsDialog('remove')}
            sx={{ borderColor: '#f44336', color: '#f44336' }}
          >
            Retirer
          </Button>
          <Button 
            size="small" 
            variant="outlined"
            startIcon={<EmojiEventsIcon />}
            onClick={() => handleOpenPointsDialog('redeem')}
            sx={{ borderColor: theme.secondary, color: theme.secondary }}
          >
            Échanger
          </Button>
        </CardActions>
      </Card>
      
      <PointsActionDialog
        open={pointsDialogOpen}
        onClose={() => setPointsDialogOpen(false)}
        action={dialogAction}
        childId={childId}
        thresholds={thresholds}
      />
    </>
  );
};

export default ChildCard;