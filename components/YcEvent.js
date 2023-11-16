import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Grid, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { GET_YC_EVENT } from "@/lib/gqlQueries/createYCEventgql";

const YcEvent = ({eventIdProp, review, edit}) => {
  const router = useRouter();
  const eventId = router.query.eventId || eventIdProp;
  const {data, loading, error} = useQuery(GET_YC_EVENT, {variables: {id: eventId}});
  const moreThan600px = useMediaQuery('(min-width:600px)');

  const goTocreateEventTicket = () => {
    router.push({
      pathname: '/yachty/create_yc_event/create_event_ticket',
      query: {
        eventId
      }
    });
  };
  if (loading || !data) return <CircularProgress />;

  const { image, event_name: eventName, location, hours, date, entertainment, specialNotes } = data.yc_events[0];
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
          <Typography variant="h4" sx={{marginTop: 2}}>{ date }</Typography>
          <Typography variant="h3" sx={{margin: 3}}>{ eventName }</Typography>
          <Box
            component="img"
            sx={{
              padding: 5,
              height: '100%',
              width: '100%',
            }}
            alt="Event Image"
            src={image}
          />
          <Box sx={{margin: 2}}></Box>
          <Grid container justifyContent="space-around">
            <Typography variant="h6">
              Held at: { location }
            </Typography>
            <Typography variant="h6">
              Hours: { hours}
            </Typography>
          </Grid>
          <Stack sx={{margin: 2}} spacing={.5}>
            <Typography>Featuring special guest: {entertainment}</Typography>
            <Typography>SpecialNotes: { specialNotes }</Typography>
            {review && (
              <Grid>
                <Button sx={{margin: 2}} onClick={edit} startIcon={<ArrowBackIcon />}>Edit Event</Button>
                <Button sx={{margin: 2}} onClick={goTocreateEventTicket} endIcon={<ArrowForwardIcon />}>Create Event Ticket</Button>
              </Grid>
            )}
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}

export default YcEvent;