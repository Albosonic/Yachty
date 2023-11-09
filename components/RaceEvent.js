import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Grid, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GET_RACE_BY_ID } from "@/lib/gqlQueries/racinggql";

const RaceEvent = ({newRaceId, edit}) => {
  const router = useRouter();
//   const eventId = router.query.eventId || eventIdProp;
  const {data, loading, error} = useQuery(GET_RACE_BY_ID, {variables: { raceId: newRaceId }});
  const moreThan600px = useMediaQuery('(min-width:600px)');

//   const goTocreateEventTicket = () => {
//     router.push({
//       pathname: '/yachty/create_yc_event/create_event_ticket',
//       query: {
//         eventId
//       }
//     });
//   };
  if (loading) return <CircularProgress />;
  
  const race = data.races[0];
  const {startDate, endDate, img, raceName, eventId} = race;
  // const { image, event_name: eventName, location, hours, date, entertainment, specialNotes } = data.yc_events[0];
  const posterWidth = moreThan600px ? 550 : 300;
  return (
    <>
      <Paper sx={{padding: 5, maxWidth: 700, margin: '0 auto', marginBottom: 5, marginTop: 5 }} elevation={3}>
        <Stack 
          display="flex" 
          alignItems="center"
          sx={{
            margin: '0 auto',
            border: '1px solid black',
            minWidth: posterWidth,
          }}
        >

          <Typography variant="h4" sx={{marginTop: 2}}>{ raceName }</Typography>
          {/* <Typography variant="h3" sx={{margin: 3}}>{ eventName }</Typography> */}
          <Box
            component="img"
            sx={{
              minHeight: 500,
              height: '100%',
              width: 400,
            }}
            alt="Event Image"
            // src={image}
          />
          <Stack sx={{margin: 2}} spacing={.5}>        
            <Grid>
              <Button sx={{margin: 2}} onClick={edit} startIcon={<ArrowBackIcon />}>Edit Race</Button>
              <Button sx={{margin: 2}} onClick={console.log('link to event')} endIcon={<ArrowForwardIcon />}>Link To YC Event</Button>
            </Grid>
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}

export default RaceEvent;