import { GET_YC_EVENT } from "@/pages/yachty/create_yc_event/createYCEventgql";
import { useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from "next/router";

const YcEvent = ({eventIdProp, review, edit}) => {
  const router = useRouter();
  const eventId = router.query.eventId || eventIdProp;
  const {data, loading, error} = useQuery(GET_YC_EVENT, {variables: {id: eventId}});
  
  const createEventTicket = () => {
    router.push({
      pathname: '/yachty/create_yc_event/create_event_ticket',
      query: {
        eventId
      }
    });
  };
  if (loading || !data) return <CircularProgress />;
  console.log('data :', data.yc_events[0]);
  const { image, event_name: eventName, location, hours, date, entertainment, specialNotes } = data.yc_events[0];

  return (
    <>
      <Paper sx={{padding: 5, maxWidth: 700, maxHeight: 950, margin: '0 auto', marginBottom: 20}} elevation={3}>
        <Stack display="flex" alignItems="center" sx={{margin: '0 auto', marginBottom: 5, border: '1px solid black'}}>
          <Typography variant="h4" sx={{marginTop: 2}}>{ date }</Typography>
          <Typography variant="h3" sx={{margin: 3}}>{ eventName }</Typography>
          <Box
            component="img"
            sx={{
              height: 500,
              width: 400,
            }}
            alt="The house from the offer."
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
          <Stack sx={{margin: 2}}>
            <Typography>Featuring special guest: {entertainment}</Typography>
            <Typography>SpecialNotes: { specialNotes }</Typography>
            {review && (
              <Grid>
                <Button sx={{margin: 2}} onClick={edit} startIcon={<ArrowBackIcon />}>Edit Event</Button>
                <Button sx={{margin: 2}} onClick={createEventTicket} endIcon={<ArrowForwardIcon />}>Create Event Ticket</Button>
              </Grid>
            )}
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}

export default YcEvent;