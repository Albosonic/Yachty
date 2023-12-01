import NavBar from '@/components/NavBar';
import { gql, useMutation, useQuery } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import Fab from '@mui/material/Fab';
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Snackbar, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import {  useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import EventPaymentDialog from './EventPaymentDialog';
import LoadingYachty from './LoadingYachty';

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

const GET_PURCHASED_EVENT_TICKETS_BY_IDS = gql`
  query getPurchasedEventTicketsById($eventId: uuid!, $memberId: uuid!) {
    yc_event_purchased_tickets(where: {eventId: {_eq: $eventId}, memberId: {_eq: $memberId}}) {
    paid
    id
  }
}`;

const GET_EVENT_TICKET_FOR_PURCHASE = gql`
  query getEventTicketForPurchase($eventId: uuid!) {
  yc_event_tickets_for_purchase(where: {eventId: {_eq: $eventId}}) {
    id
    cost
  }
}
`

const EventTicketForPurchase = ({ eventData, linkToRace }) => {
  const router = useRouter();
  const memberId = useSelector(state => state.auth.member.id );
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [insertTickets, {error: insertError, loading: insertLoading, data: insertData}] = useMutation(INSERT_PURCHASED_TICKETS)
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const [eventLinked, setEventLinked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [puchasedTicketsInfo, setPurchasedTicketInfo] = useState({totalTickets: 0, unpaid: 0});
  const moreThan600px = useMediaQuery('(min-width:600px)');
  
  const {
    date,
    entertainment,
    event_name: eventName,
    hours,
    image,
    location,
    specialNotes,
    yc_event_tickets_for_purchase,
    id: eventId,
  } = eventData;

  const {error, loading, data, refetch} = useQuery(GET_PURCHASED_EVENT_TICKETS_BY_IDS, { variables: {eventId, memberId}});  
  const {error: forPurchaseError, loading: forPurchaseLoading, data: forPurchaseData} = useQuery(GET_EVENT_TICKET_FOR_PURCHASE, { variables: {eventId}});
  const purchasedTicketData = data?.yc_event_purchased_tickets;
  
  useEffect(() => {
    let unpaid = 0;
    let totalTickets = 0;
    if (loading) return;
    purchasedTicketData.forEach(ticket => {
      totalTickets++;
      if (ticket.paid === false) unpaid++;
    });
    setPurchasedTicketInfo({totalTickets, unpaid})
  }, [purchasedTicketData]);

  if (loading) return <LoadingYachty isRoot={false} />;

  const {cost, id: ticketId} = forPurchaseData?.yc_event_tickets_for_purchase[0]

  const reserveTicket = async () => {
    // TODO: make this a batch update
    if (ticketCount === 0) return;
    let noTickets = ticketCount;
    while(noTickets > 0) {
      await insertTickets({variables: { memberId: memberId, ticketForPurchaseId: ticketId, eventId: eventId }});
      noTickets--;
    }
    setTicketCount(0);
    setShowSuccess(true);
    refetch({ variables: {eventId, memberId}})
  }

  const handleClose = () => {
    setTicketCount(0);
    setShowSuccess(false);
  };

  const linkEventTicketToRace = async (ticketId) => {
    await linkToRace();
    setEventLinked(true);
  }

  const { totalTickets, unpaid } = puchasedTicketsInfo

  const cardWidthMin = moreThan600px ? 700 : 200;
  const cardWidthMax = moreThan600px ? 200 : 700;

  return (
    <Stack sx={{margin: 5}}>      
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Success!
        </Alert>
      </Snackbar>
      <EventPaymentDialog open={openDialog} setOpenDialog={setOpenDialog}/>
      <Card
        elevation={4}
        sx={{
          display: 'flex',
          maxWidth: cardWidthMax,
          minWidth: cardWidthMin,
          margin: '0 auto',
          marginBottom: 5,
          margin: 3,
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={image}
          alt="Event Image"
        />
        <Stack sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5">
              {eventName}
            </Typography>
            {entertainment && <Typography variant="subtitle1" color="text.secondary" component="div">Entertainment: {entertainment}</Typography>}
            {date && <Typography>date: {date}</Typography>}
            {location && <Typography>location: {location}</Typography>}
            {eventLinked && <Typography variant="h5" sx={{color: 'green', transform: "rotate(-30deg)"}}>You're all set!</Typography>}
            {!linkToRace &&
            <Grid container display="flex" direction="row">
              <Typography sx={{lineHeight: 2.5}} variant='body1'>How Many Tickets: {ticketCount}</Typography>
              <Button onClick={reserveTicket}>Reserve</Button>
            </Grid>}
            <Typography variant='body1'>Already reserved: {totalTickets}</Typography>
            <Grid container>
              <Typography sx={{lineHeight: 2.5}} variant='body1'>unpaid: {unpaid}</Typography>
              <Button onClick={() => setOpenDialog(true)}>
                Payment Info
              </Button>
            </Grid>
          </CardContent>
          {/* <Grid sx={{ width: '100%', height: 50, display: 'flex', justifyContent: 'flex-end' }}>
            <AttachMoneyIcon color='action' sx={{ lineHeight: 2, color: 'black', fontSize: 35, marginTop: 1}} />
            <Typography sx={{color: 'black', fontSize: 35, marginRight: 1}}>{ amount }</Typography>
          </Grid> */}
        </Stack>
        {linkToRace ? (
          <Box display="flex" sx={{ '& > :not(style)': { m: 1 } }}>
            <Stack spacing={2} alignItems="center">
              <Fab variant="extended" onClick={linkEventTicketToRace} size="medium" color='success'  aria-label="add">
                <AddIcon />
                Link
              </Fab>
            </Stack>
            <Grid container flexWrap="nowrap" sx={{bottom: 0, width: '100%', height: '100%', margin: '0 auto' }}>
              <AttachMoneyIcon color='action' sx={{ alignSelf: 'flex-end', color: 'black', fontSize: 40, marginBottom: 1}} />
              <Typography sx={{alignSelf: 'flex-end', color: 'black', fontSize: 35, marginRight: 1}}>{ cost }</Typography>


              
            </Grid>            
          </Box>
        ) : (
          <Stack alignItems="center" sx={{'& > :not(style)': { m: 1 } }}>
            <Stack spacing={2} alignItems="center">
              <Fab onClick={() => setTicketCount(ticketCount + 1)} size="medium" color='success'  aria-label="add">
                <AddIcon />
              </Fab>
              <Fab onClick={() => setTicketCount(ticketCount - 1)} size='small'>
                <RemoveIcon color="error" />
              </Fab>
            </Stack>
            <Grid container flexWrap="nowrap" sx={{ width: '100%', height: '100%' }}>
              <AttachMoneyIcon color='action' sx={{ alignSelf: 'flex-end', lineHeight: 2, color: 'black', fontSize: 35, marginTop: 1}} />
              <Typography sx={{alignSelf: 'flex-end', color: 'black', fontSize: 35, lineHeight: 1}}>{ cost }</Typography>
            </Grid>            
          </Stack>
        )}
      </Card>
    </Stack>
  )
}

export default EventTicketForPurchase;