import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const YcEventPoster = ({ eventData }) => {
  const router = useRouter();
  const { image, event_name: eventName, location, hours, date, entertainment, specialNotes, id: eventId } = eventData;
  console.log('image ===', image)
  console.log('eventName ===', eventName)
  const isCommodore = useSelector(state => state.auth.userIsCommodore);
  console.log('isCommodore', isCommodore);
  return (
    <>
      <Paper sx={{padding: 5, maxWidth: 700, margin: '0 auto', marginBottom: 20}} elevation={3}>
        <Stack display="flex" alignItems="center" sx={{margin: '0 auto', border: '1px solid black'}}>
          <Typography variant="h4" sx={{marginTop: 2}}>{ date }</Typography>
          <Typography variant="h3" sx={{margin: 3}}>{ eventName }</Typography>
          <Box
            component="img"
            sx={{
              height: '100%',
              width: '100%',
              padding: 5,
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
              Hours: { hours }
            </Typography>
          </Grid>
          <Stack sx={{margin: 2}} spacing={.5}>
            <Typography>Featuring special guest: {entertainment}</Typography>
            <Typography>SpecialNotes: { specialNotes }</Typography>
          </Stack>
          <Grid container justifyContent="space-around">
            <Button onClick={() => router.push({pathname: '/yachty/yc_feed/purchase_event_ticket', query: {eventId}})}>RSVP</Button>
            {isCommodore && <Button onClick={() => router.push({pathname: '/yachty/yc_feed/see_event_res', query: {eventId}})}>See Member RSVP</Button>}
          </Grid>
        </Stack>
      </Paper>
    </>
  )
};

export default YcEventPoster;