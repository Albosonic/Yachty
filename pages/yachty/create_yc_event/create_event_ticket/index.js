import NavBar from '@/components/NavBar';
import { useQuery } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import {  useState } from 'react';
import { GET_YC_EVENT } from '../createYCEventgql';



const CreateEventTicket = (props) => {
  const router = useRouter();
  const id = router.query.eventId;
  const {data, loading, error} = useQuery(GET_YC_EVENT, {variables: {id}});
  const [amount, setAmount] = useState(null);
  if (loading) return <CircularProgress />;
  console.log(data);
  const createTicket = async () => {

  }
const {
    date,
    entertainment,
    event_name: eventName,
    hours,
    id: eventId,
    image,
    raceId,
    special_club_hours,
    location,
    specialNotes,
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
        marginBottom: 5
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={image}
        alt="Event Image"
      />
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {eventName}
          </Typography>
          {entertainment && <Typography variant="subtitle1" color="text.secondary" component="div">Entertainment :{entertainment}</Typography>}
          {date && <Typography>when: {date}</Typography>}
          {location && <Typography>where: {location}</Typography>}
          {specialNotes && <Typography>{specialNotes}</Typography>}
        </CardContent>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', pl: 1, pb: 1 }}>
          <AttachMoneyIcon color='action' sx={{color: 'black', fontSize: "40px", marginTop: 1}} />
          <Typography sx={{color: 'black', fontSize: "40px", marginRight: 1}}>{ amount }</Typography>
        </Box>
      </Box>
      <Box display="flex" sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab size="medium" color='success'  aria-label="add">
          <AddIcon />
        </Fab>
      </Box>
    </Card>
    <Grid display="flex" direction="row" justifyContent="center" sx={{marginTop: 0}}>
      <TextField
        id="ticket-cost"
        label="Enter Cost"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => setAmount(e.target.value)}
      />
    </Grid>
    </>
  );
}

export default CreateEventTicket;