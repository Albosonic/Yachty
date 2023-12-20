import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { workingRaceDateAct } from '@/slices/actions/schedulerActions';
import { useRouter } from 'next/router';

const CalendarDayClickMenu = ({scheduler}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleCreateRace = () => {
    dispatch(workingRaceDateAct(scheduler.state));
    router.replace({pathname: '/yachty/create_races', query: {workingDate: true} })
  }

  return (
    <Box sx={{ width: '100%', justifyContent: "center", maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="secondary mailbox folder">
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={(event) => handleCreateRace(event)}
        >
          <ListItemText primary="Create Event" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemText primary="Create Race" />
        </ListItemButton>
      </List>
    </Box>
  );
}

export default CalendarDayClickMenu;
