import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Snackbar, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import {  useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import NavBar from '@/components/NavBar';
import { GET_YC_EVENT, UPSERT_EVENT_TICKET } from '@/lib/gqlQueries/createYCEventgql';
import LoadingYachty from '@/components/LoadingYachty';

const CreateEventTicket = (props) => {
  const router = useRouter();
  const id = router.query.eventId;
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const {data, loading, error} = useQuery(GET_YC_EVENT, {variables: {id}});
  const [createYachtClubEventTicket, { loading: ticketLoading, data: ticketData, error: ticketError }] = useMutation(UPSERT_EVENT_TICKET);
  const [amount, setAmount] = useState(null);
  const [dinnerAmount, setDinnerAmount] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const moreThan600px = useMediaQuery('(min-width:600px)');
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
  } = data.yc_events[0];

  const createYCEventTicket = async () => {
    let variables = {
      dinnerCost: dinnerAmount,
      cost: amount,
      eventId,
      ycId,
    }
    setShowSpinner(true);
    await createYachtClubEventTicket({ variables });
    setShowSuccess(true);
    setShowSpinner(false);
  }

  const handleClose = () => router.push({ pathname: '/yachty', query: { ycId } });
  const contentDirection = moreThan600px ? 'row' : 'column';
  return (
    <>
    <NavBar />
    <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        Success!
      </Alert>
    </Snackbar>
    <Stack sx={{margin: 5}} alignItems="center">
      <Card
        elevation={4}
        sx={{
          display: 'flex',
          flexDirection: contentDirection,
          maxWidth: 650,
          // margin: '0 auto',
          marginBottom: 5
        }}
      >
        <CardMedia
          component="img"
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
            {showSpinner && <CircularProgress />}
          </CardContent>
        </Box>
        <Stack display="flex" alignItems="center" sx={{minWidth: 100, margin: 1}}>
          <Fab disabled={showSpinner} onClick={createYCEventTicket} size="medium" color='success'  aria-label="add">
            <AddIcon />
          </Fab>
          <Grid container flexWrap="nowrap" sx={{margin: 2 }} >
            <AttachMoneyIcon color='action' sx={{color: 'black', fontSize: 24}} />
            <TextField
              multiline
              id="ticket-cost"
              label="Event"
              type="number"
              variant="standard"
              sx={{maxWidth:70}}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setAmount(e.target.value)
              }}
            />
          </Grid>
          <Grid container flexWrap="nowrap" sx={{margin: 2 }} >
            <AttachMoneyIcon color='action' sx={{color: 'black', fontSize: 24}} />
            <TextField
              multiline
              id="ticket-cost"
              label="Dinner"
              type="number"
              variant="standard"
              sx={{maxWidth:70}}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setDinnerAmount(e.target.value)
              }}
            />
          </Grid>
        </Stack>
      </Card>
    </Stack>
    </>
  );
}

export default CreateEventTicket;