import { gql, useMutation, useQuery } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Fab from '@mui/material/Fab';
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Snackbar, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EventPaymentDialog from './EventPaymentDialog';
import LoadingYachty from './LoadingYachty';

const INSERT_PURCHASED_TICKETS = gql`
  mutation insertPurchasedTickets(
    $memberId: uuid!,
    $ticketForPurchaseId: uuid!,
    $eventId: uuid!,
    $withDinner: Boolean
  ) {
  insert_yc_event_purchased_tickets(
  objects: [{
    memberId: $memberId,
    ticketForPurchaseId: $ticketForPurchaseId,
    withDinner: $withDinner,
    eventId: $eventId,
  }]) {
    returning {
      memberId
      ticketForPurchaseId,
      withDinner,
      eventId,
    }
  }
}`;

const UPDATE_PURCHASED_TICKET = gql`
  mutation updatePurchasedTicket($ticketId: uuid!, $withDinner: Boolean!) {
  update_yc_event_purchased_tickets(
    where: {
      id: {
        _eq: $ticketId
      }},
      _set: {
        withDinner: $withDinner
      }
    ) {
    affected_rows
  }
}`;

const GET_PURCHASED_EVENT_TICKETS_BY_IDS = gql`
  query getPurchasedEventTicketsById($eventId: uuid!, $memberId: uuid!) {
    yc_event_purchased_tickets(where: {eventId: {_eq: $eventId}, memberId: {_eq: $memberId}}) {
    withDinner
    paid
    id
  }
}`;

const GET_EVENT_TICKET_FOR_PURCHASE = gql`
  query getEventTicketForPurchase($eventId: uuid!) {
  yc_event_tickets_for_purchase(where: {eventId: {_eq: $eventId}}) {
    id
    cost
    dinnerCost
  }
}`;

const EventTicketForPurchase = ({ eventData, linkToRace }) => {
  const memberId = useSelector(state => state.auth.member.id );
  const [insertTickets, {loading: insertLoading}] = useMutation(INSERT_PURCHASED_TICKETS);
  const [updatePurchasedTicket, {loading: updateLoading}] = useMutation(UPDATE_PURCHASED_TICKET);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const [dinnerTicketCount, setDinnerTicketCount] = useState(0)
  const [eventLinked, setEventLinked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [noDinnerPurchasedTicket, setNodinnerPurchasedTicket] = useState([]);
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
    let noDinner = [];    
    if (loading) return;
    purchasedTicketData.forEach(ticket => {
      totalTickets++;
      if (ticket.paid === false) unpaid++;
      if (ticket.withDinner === false) noDinner.push(ticket);
    });
    setNodinnerPurchasedTicket([...noDinner])
    setPurchasedTicketInfo({totalTickets, unpaid})
  }, [purchasedTicketData]);

  if (loading) return <LoadingYachty isRoot={false} />;

  // const {cost, id: ticketId} = forPurchaseData?.yc_event_tickets_for_purchase[0]
  const eventForPurchase = forPurchaseData?.yc_event_tickets_for_purchase[0];
  const cost = eventForPurchase?.cost;
  const dinnerCost = eventForPurchase?.dinnerCost;
  const ticketId = eventForPurchase?.id;

  const reserveTickets = async () => {
    if (ticketCount === 0 && dinnerTicketCount === 0) return;
    let numTickets = ticketCount;
    let numDinnerTickets = dinnerTicketCount;
    while (numTickets > 0) {
      const withDinner = (numDinnerTickets > 0);
      await insertTickets({
        variables: {
          memberId,
          eventId,
          withDinner,
          ticketForPurchaseId: ticketId,
        }
      });
      numTickets--;
      numDinnerTickets--;
    }
    
    noDinnerPurchasedTicket.forEach(async noDinTicket => {
      console.log('noDinTik =======', noDinTicket.id);
      const ticketId = noDinTicket.id;
      await updatePurchasedTicket({
        variables: {
          ticketId,
          withDinner: true,
        }
      })      
    })
    
    setTicketCount(0);
    setDinnerTicketCount(0);
    setShowSuccess(true);
    refetch({
      variables: {
        eventId,
        memberId
      }
    })
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

  const cardDirection = moreThan600px ? 'row' : 'column';

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
          flexDirection: cardDirection,
        }}
      >
        <CardMedia
          component="img"
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
            <Grid container justifyContent="space-between">
              {/* <Button onClick={reserveTicket}>Reserve</Button> */}

              <Typography sx={{lineHeight: 2.5}} variant='body1'>Event Tickets:</Typography>
              <Grid
                container
                flexWrap="nowrap"
                justifyContent="center"
                sx={{
                  maxWidth: 70,
                  marginLeft: -5,
                }} >
                <AttachMoneyIcon
                  color='action'
                  sx={{
                    color: 'black',
                    fontSize: 25,
                    marginTop: 1,
                    lineHeight: 2.5
                  }}
                />
                <Typography
                  sx={{
                    lineHeight: 1.75,
                    fontSize: 25,
                  }}>
                  {cost}
                </Typography>
              </Grid>
                <Grid>
                <IconButton onClick={() => setTicketCount(ticketCount - 1)}>
                  <RemoveIcon color='error' />
                </IconButton>
                <IconButton onClick={() => setTicketCount(ticketCount + 1)}>
                  <ControlPointOutlinedIcon color='success' />
                </IconButton>
              </Grid>
            </Grid>}

            {!linkToRace &&
              <Grid container>
                <Grid container minWidth={100} justifyContent="space-between" flexWrap="nowrap">
                  <Typography sx={{lineHeight: 2.5}}>Dinner Tickets:</Typography>
                    <Grid
                      container
                      flexWrap="nowrap"
                      justifyContent="center"
                      sx={{
                        maxWidth: 70,
                        marginLeft: -5,
                      }} >
                      <AttachMoneyIcon
                        color='action'
                        sx={{
                          color: 'black',
                          fontSize: 25,
                          marginTop: 1,
                          lineHeight: 2.5
                        }} />
                        <Typography
                          sx={{
                            lineHeight: 1.75,
                            fontSize: 25,
                          }}>
                          {dinnerCost}
                        </Typography>
                    </Grid>
                  <Grid>
                    <IconButton onClick={() => setDinnerTicketCount(dinnerTicketCount - 1)}>
                      <RemoveIcon color='error' />
                    </IconButton>
                    <IconButton onClick={() => setDinnerTicketCount(dinnerTicketCount + 1)}>
                      <ControlPointOutlinedIcon color='success' />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            }

            <Typography variant='body1'>Total for Event: {totalTickets + ticketCount}</Typography>
            <Typography variant='body1'>Total fro Dinner: {dinnerTicketCount}</Typography>
            <Grid container>
              <Typography sx={{lineHeight: 2.5}} variant='body1'>unpaid: {unpaid}</Typography>
              <Button onClick={() => setOpenDialog(true)}>
                Payment Info
              </Button>
            </Grid>
          </CardContent>
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
              <Fab
                variant="extended"
                onClick={reserveTickets}
                size="medium"
                color='success'
                aria-label="add"
              >
                <AddIcon />
                confirm
              </Fab>
            </Stack>
          </Stack>
        )}
      </Card>
    </Stack>
  )
}

export default EventTicketForPurchase;