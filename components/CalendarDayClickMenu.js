import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { workingEventDateAct, workingRaceDateAct } from '@/slices/actions/schedulerActions';
import { useRouter } from 'next/router';
import { PARTY, RACE } from '@/pages/yachty/calendar';
import { Button, Grid } from '@mui/material';

const CalendarDayClickMenu = ({ scheduler }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = useState(1);

  useEffect(() => {
    const eventString = scheduler?.edited?.event_id
    if (eventString) {
      const eventSplitArr = eventString.split('/');
      const eventType = eventSplitArr[1];
      const eventId = eventSplitArr[0];
      dispatch(workingRaceDateAct(scheduler.state));
      if (eventType === RACE) {
        router.replace({pathname: '/yachty/create_races', query: { workingDate: true, raceId: eventId }});
      }
      if (eventType === PARTY) {
        router.replace({pathname: '/yachty/create_yc_event', query: { workingDate: true, eventId: eventId }});
      }
    }
  }, [scheduler?.edited?.event_id])

  const handleCreateEvent = () => {
    dispatch(workingEventDateAct(scheduler.state.start.value));
    router.replace({ pathname: '/yachty/make_new_event', query: { workingDate: true } });
  };

  const handleCreateRace = () => {
    dispatch(workingRaceDateAct(scheduler.state.start.value));
    router.replace({pathname: '/yachty/make_new_race', query: { workingDate: true }})
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '50vh' }}
    >
      <Button
        color='primary'
        size='large'
        variant='outlined'
        sx={{padding: 3, marginTop: 2, width: '90%'}}
        onClick={handleCreateEvent}

      >
        Create Event
      </Button>
      <Button        
        color='primary'
        size='large'
        variant='outlined'
        sx={{padding: 3, marginTop: 2, width: '90%'}}
        onClick={handleCreateRace}
      >
        Crate Race
      </Button>      
    </Grid>
  );
}

export default CalendarDayClickMenu;
