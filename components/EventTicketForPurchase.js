import NavBar from '@/components/NavBar';
import { gql, useMutation, useQuery } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import {  useState } from 'react';
import { useSelector } from 'react-redux';

const EVENT_TICKET_FOR_PURCHASE = gql`
  query getEventTicketForPurchase($eventId: uuid!) {
    yc_events(where: {id: {_eq: $eventId}}) {
    entertainment
    event_name
    hours
    image
    location
    specialNotes
    date
    yc_event_tickets_for_purchase {
      cost
      id
    }
  }
}`;



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

const EventTicketForPurchase = (props) => {
  const router = useRouter();
  const eventId = router.query.eventId;
  // const memberId = useSelector(state => state.auth.member.id);
  const member = useSelector(state => state.auth.member);

  const {loading, data, error } = useQuery(EVENT_TICKET_FOR_PURCHASE, {variables:{eventId}, fetchPolicy: "no-cache" });
  const [insertTickets, {error: insertError, loading: insertLoading, data: insertData}] = useMutation(INSERT_PURCHASED_TICKETS)
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  if (loading || !data) return <CircularProgress />;
  
  const {id: memberId, yachtClubByYachtClub: {id: ycId}} = member;

  const {
    date,
    entertainment,
    event_name: eventName,
    hours,
    image,
    location,
    specialNotes,
    yc_event_tickets_for_purchase: {cost: amount, id},
  } = data.yc_events[0];
  
  const reserveTicket = async () => {
    // TODO: make this a batch update
    let noTickets = ticketCount;
    while(noTickets > 0) {
      await insertTickets({variables: { memberId: memberId, ticketForPurchaseId: id, eventId: eventId }});
      noTickets--;
    }
    setTicketCount(0);
    setShowSuccess(true)
  }
  const handleClose = () => router.push({ pathname: '/yachty/yc_feed', query: { ycId } });

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
            {date && <Typography>date: {date}</Typography>}
            {location && <Typography>location: {location}</Typography>}
            {specialNotes && <Typography>{specialNotes}</Typography>}
          </CardContent>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', pl: 1, pb: 1 }}>
            <AttachMoneyIcon color='action' sx={{color: 'black', fontSize: "40px", marginTop: 1}} />
            <Typography sx={{color: 'black', fontSize: "40px", marginRight: 1}}>{ amount }</Typography>
          </Box>
        </Box>
        <Box display="flex" sx={{ '& > :not(style)': { m: 1 } }}>
          <Fab onClick={() => setTicketCount(ticketCount + 1)} size="medium" color='success'  aria-label="add">
            <AddIcon />
          </Fab>
        </Box>
      </Card>
      <Grid container display="flex" direction="row" justifyContent="center" sx={{marginTop: 0}}>
        <Typography variant='h5'>How Many Tickets: {ticketCount}</Typography>
        <Button onClick={reserveTicket}>Reserve</Button>
      </Grid>
    </>
  )
}

export default EventTicketForPurchase;