import { Alert, Box, Card, CardContent, CardMedia, Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import {  useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import NavBar from '@/components/NavBar';
import { UPSERT_EVENT_TICKET } from '@/lib/gqlQueries/createYCEventgql';
import LoadingYachty from './LoadingYachty';

const CreateEventTicket = ({ eventData }) => {  
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [createYachtClubEventTicket, { loading: ticketLoading, data: ticketData, error: ticketError }] = useMutation(UPSERT_EVENT_TICKET);
  const [amount, setAmount] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  if (loading) return <LoadingYachty />;
  
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
  } = eventData;

  const createYCEventTicket = async () => {
    let variables = {
      cost: amount,
      eventId,
      ycId,
    }
    await createYachtClubEventTicket({ variables });
    setShowSuccess(true);
  }

  const handleClose = () => {
    // router.push({ pathname: '/yachty', query: { ycId } }); 
    setShowSuccess(false);
  }

  return (
    <>
    <NavBar />
    <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        Success!
      </Alert>
    </Snackbar>
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
          {entertainment && <Typography variant="subtitle1" color="text.secondary" component="div">Entertainment: {entertainment}</Typography>}
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
        <Fab onClick={createYCEventTicket} size="medium" color='success'  aria-label="add">
          <AddIcon />
        </Fab>
      </Box>
    </Card>
    <Grid container display="flex" direction="row" justifyContent="center" sx={{marginTop: 0}}>
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