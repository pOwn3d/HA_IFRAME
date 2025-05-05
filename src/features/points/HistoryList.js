import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider,
  Typography,
  Box
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FlagIcon from '@mui/icons-material/Flag';

const HistoryList = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', p: 2 }}>
        Aucun historique disponible.
      </Typography>
    );
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'add':
        return <AddCircleIcon color="success" />;
      case 'remove':
        return <RemoveCircleIcon color="error" />;
      case 'redeem':
        return <EmojiEventsIcon color="secondary" />;
      case 'challenge':
        return <FlagIcon color="primary" />;
      default:
        return null;
    }
  };

  const getActionText = (item) => {
    switch (item.action) {
      case 'add':
        return `+${item.amount} points - ${item.reason}`;
      case 'remove':
        return `-${item.amount} points - ${item.reason}`;
      case 'redeem':
        return `Récompense : ${item.reason} (-${item.amount} points)`;
      case 'challenge':
        return `Défi complété : +${item.amount} points`;
      default:
        return item.reason;
    }
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {history.map((item, index) => (
        <React.Fragment key={item.timestamp}>
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              {getActionIcon(item.action)}
            </ListItemIcon>
            <ListItemText
              primary={getActionText(item)}
              secondary={
                <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary' }}>
                  {formatDate(item.timestamp)}
                </Box>
              }
            />
          </ListItem>
          {index < history.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default HistoryList;