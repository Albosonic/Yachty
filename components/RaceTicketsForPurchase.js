import { gql, useMutation, useQuery } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Snackbar, Stack, TextField, Typography } from '@mui/material';
import {  useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const INSERT_PURCHASED_TICKETS = gql`
  mutation insertPurchasedTickets($memberId: uuid!, $ticketForPurchaseId: uuid!, $eventId: uuid!) {
  insert_yc_event_purchased_tickets(
  objects: [{memberId: $memberId, ticketForPurchaseId: $ticketForPurchaseId, eventId: $eventId}]) {
    returning {
      memberId
      ticketForPurchaseId,
      eventId
    }
  }
}`;

const RaceTicketsForPurchase = ({ raceData, linkToRace }) => {  
  const router = useRouter();
  const member = useSelector(state => state.auth.member);  
  const [insertTickets, {error: insertError, loading: insertLoading, data: insertData}] = useMutation(INSERT_PURCHASED_TICKETS)
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const [eventLinked, setEventLinked] = useState(false);
  const {id: memberId, yachtClubByYachtClub: {id: ycId}} = member;

  const {    
    raceName,
    img: image,
    id: raceId,
  } = raceData[0];
  console.log('raceData ============>', raceData)
  // const amount = yc_event_tickets_for_purchase?.cost || 0;
  // const ticketId = yc_event_tickets_for_purchase?.id
  
  const reserveTicket = async () => {
    // TODO: make this a batch update
    let noTickets = ticketCount;
    while(noTickets > 0) {
      console.log('debugging no tickets')
      // await insertTickets({variables: { memberId: memberId, ticketForPurchaseId: ticketId, eventId: eventId }});
      noTickets--;
    }
    setTicketCount(0);
    setShowSuccess(true);
  }

  const handleClose = () => {
    console.log('pathName', router.pathname)
    if (router.pathname === '/yachty/racing/reservations') {
      setTicketCount(0);
      setShowSuccess(false)
    } else {
      router.push({ pathname: '/yachty/yc_feed', query: { ycId } })
    }    
  };

  return (
    <Stack sx={{margin: 5}}>
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
              {raceName}
            </Typography>
            {/* {entertainment && <Typography variant="subtitle1" color="text.secondary" component="div">Entertainment: {entertainment}</Typography>}
            {date && <Typography>date: {date}</Typography>}
            {location && <Typography>location: {location}</Typography>}
            {specialNotes && <Typography>{specialNotes}</Typography>}
            {eventLinked && <Typography variant="h5" sx={{color: 'green', transform: "rotate(-30deg)"}}>You're all set!</Typography>} */}
          </CardContent>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', pl: 1, pb: 1 }}>
            <AttachMoneyIcon color='action' sx={{color: 'black', fontSize: "40px", marginTop: 1}} />
            {/* <Typography sx={{color: 'black', fontSize: "40px", marginRight: 1}}>{ amount }</Typography> */}
          </Box>
        </Box>
      </Card>      
      <Grid container display="flex" direction="row" justifyContent="center" sx={{marginTop: 0}}>
        <Typography variant='h5'>How Many Tickets: {ticketCount}</Typography>
        <Button onClick={reserveTicket}>Reserve</Button>
      </Grid>
    </Stack>
  )
}

export default RaceTicketsForPurchase;