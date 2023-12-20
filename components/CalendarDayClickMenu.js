import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { workingRaceDateAct } from '@/slices/actions/schedulerActions';
import { useRouter } from 'next/router';
import { PARTY, RACE } from '@/pages/yachty/calendar';

const CalendarDayClickMenu = ({ scheduler }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(1);

  useEffect(() => {    
    const eventString = scheduler?.edited?.event_id
    if (eventString) {
      const eventSplitArr = eventString.split('/');      
      dispatch(workingRaceDateAct(scheduler.state));
      if (eventSplitArr[1] === RACE) {        
        router.replace({pathname: '/yachty/create_races', query: { workingDate: true, raceId: scheduler?.edited?.event_id }});
      }
      if (eventSplitArr[1] === PARTY) {
        router.replace({pathname: '/yachty/create_yc_event', query: { workingDate: true, eventId: scheduler?.edited?.event_id }});
      }
    }
  }, [scheduler?.edited?.event_id])

  const handleCreateEvent = () => {    
    dispatch(workingRaceDateAct(scheduler.state));
    router.replace({ pathname: '/yachty/create_yc_event', query: { workingDate: true } });
  };

  const handleCreateRace = () => {
    dispatch(workingRaceDateAct(scheduler.state));    
    router.replace({pathname: '/yachty/create_races', query: { workingDate: true }})
  }

  return (
    <Box sx={{ width: '100%', justifyContent: "center", maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="secondary mailbox folder">
        <ListItemButton
          selected={selectedIndex === 2}
          onClick={handleCreateRace}
        >
          <ListItemText primary="Create Race" />
        </ListItemButton>
        <ListItemButton
          selected={selectedIndex === 3}
          onClick={handleCreateEvent}
        >
          <ListItemText primary="Create Event" />
        </ListItemButton>
      </List>
    </Box>
  );
}

export default CalendarDayClickMenu;
