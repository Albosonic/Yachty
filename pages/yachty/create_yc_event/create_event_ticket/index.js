import NavBar from '@/components/NavBar';
import { useQuery } from '@apollo/client';
import { Avatar, Box, Card, CardContent, CardMedia, CircularProgress, IconButton, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { GET_YC_EVENT } from '../createYCEventgql';

const CreateEventTicket = (props) => {
  const router = useRouter();
  const id = router.query.eventId;
  const {data, loading, error} = useQuery(GET_YC_EVENT, {variables: {id}});
  if (loading) return <CircularProgress />;
  console.log(data);

const {
    date,
    entertainment,
    event_name: eventName,
    hours,
    id: eventId,
    image,
    raceId,
    special_club_hours
  } = data.yc_events[0];
  console.log(data.yc_events[0]);
  return (
    <>
    <NavBar />
    <Card
      elevation={4}
      sx={{
        display: 'flex',
        maxWidth: 600,
        margin: '0 auto',
        marginBottom: 20
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={image}
        alt="Event Image"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {eventName}
          </Typography>
          {entertainment && <Typography variant="subtitle1" color="text.secondary" component="div">
            Entertainment :{entertainment}
          </Typography>}
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          {/* <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton> */}
        </Box>
      </Box>
    </Card>
    {/* </Paper> */}
    </>
  );
}

export default CreateEventTicket;