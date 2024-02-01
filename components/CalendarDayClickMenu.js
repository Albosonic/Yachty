import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Fab, Grid } from '@mui/material';
import { workingEventDateAct, workingRaceDateAct } from '@/slices/actions/schedulerActions';
import { GET_RACE_BY_ID } from '@/lib/gqlQueries/racinggql';
import client from '@/lib/clients/apollo-client';
import { PARTY, RACE } from '@/lib/strings';
import { clearNewRaceFieldsAct, hydrateWorkingRaceAct } from '@/slices/actions/workingRaceActions';
import { clearNewEventFieldsAct, hydrateWorkingEventAct } from '@/slices/actions/workingEventActions';
import { GET_YC_EVENT } from '@/lib/gqlQueries/createYCEventgql';

const CalendarDayClickMenu = ({ scheduler }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  // const [selectedIndex, setSelectedIndex] = useState(1);
  // const {data, loading, error} = useQuery(GET_RACE_BY_ID, {variables: { raceId: newRaceId }});

  const getRace = async (raceId) => {
    const resp = await client.query({
      query: GET_RACE_BY_ID,
      variables: {raceId},
      fetchPolicy: 'no-cache',
    })
    return resp
  }

  const getEvent = async (eventId) => {
    const resp = await client.query({
      query: GET_YC_EVENT,
      variables: {id: eventId},
      fetchPolicy: 'no-cache',
    })
    return resp
  }

  useEffect(() => {
    if (scheduler.edited) {
      const {type: eventType, event_id: eventId} = scheduler.edited;
      if (eventType === RACE) {
        const resp = getRace(eventId)
        resp.then(raceData => {
          const race = raceData.data.races[0]
          dispatch(hydrateWorkingRaceAct(race))
        })
        router.replace({pathname: '/yachty/make_new_race', query: { workingDate: true, raceId: eventId }});
      }
      if (eventType === PARTY) {
        const resp = getEvent(eventId)
        resp.then(eventData => {
          const event = eventData.data.yc_events[0]
          dispatch(hydrateWorkingEventAct(event))
        })
        router.replace({pathname: '/yachty/make_new_event', query: { workingDate: true, eventId: eventId }});
      }
    }
  }, [scheduler?.edited?.event_id])

  const handleCreateEvent = () => {
    dispatch(workingEventDateAct(scheduler.state.start.value));
    dispatch(clearNewEventFieldsAct())
    router.replace({ pathname: '/yachty/make_new_event', query: { workingDate: true } });
  };

  const handleCreateRace = () => {
    dispatch(workingRaceDateAct(scheduler.state.start.value));
    dispatch(clearNewRaceFieldsAct())
    router.replace({pathname: '/yachty/make_new_race', query: { workingDate: true }})
  }

  const goBack = () => {
    router.reload()
  }

  return (
    <>
      <Fab size="medium" onClick={goBack} variant="extended" sx={{ margin: 3, alignSelf: 'flex-start' }} color="primary">
        <ArrowBackIcon /> Back
      </Fab>
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
    </>
  );
}

export default CalendarDayClickMenu;
