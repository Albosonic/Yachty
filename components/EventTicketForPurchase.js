import { gql, useMutation, useQuery } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Fab from '@mui/material/Fab';
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Divider, Grid, IconButton, Snackbar, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EventPaymentDialog from './EventPaymentDialog';
import LoadingYachty from './LoadingYachty';
import { DELETE_EVENT_TICKET, GET_EVENT_TICKET_FOR_PURCHASE, GET_PURCHASED_EVENT_TICKETS_BY_IDS, INSERT_PURCHASED_TICKETS, UPDATE_PURCHASED_TICKET } from '@/lib/gqlQueries/ticketsGQL';

const EventTicketForPurchase = ({ eventData, linkToRace }) => {
  const memberId = useSelector(state => state.auth.member.id );
  const [formErrors, setFormErrors] = useState({ tooManyDinTicketsErr: false })
  const [ticketCount, setTicketCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dinnerTicketCount, setDinnerTicketCount] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false);
  const [eventLinked, setEventLinked] = useState(false);
  const [noDinnerPurchasedTickets, setNodinnerPurchasedTickets] = useState([]);
  const [withDinnerTickets, setWithDinnerTickets] = useState([]);
  const [purchasedTicketsInfo, setPurchasedTicketInfo] = useState({totalTickets: 0, totalDinners: 0, unpaid: 0});

  const [insertTickets, {loading: insertLoading}] = useMutation(INSERT_PURCHASED_TICKETS);
  const [updatePurchasedTicket, {loading: updateLoading}] = useMutation(UPDATE_PURCHASED_TICKET);
  const [deleteEventTicket, {loading: deleteLoading}] = useMutation(DELETE_EVENT_TICKET);

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

  const {error, loading, data, refetch} = useQuery(GET_PURCHASED_EVENT_TICKETS_BY_IDS, { 
    fetchPolicy: 'no-cache',
    variables: {
      eventId, 
      memberId
    }
  });
  const {error: forPurchaseError, loading: forPurchaseLoading, data: forPurchaseData} = useQuery(GET_EVENT_TICKET_FOR_PURCHASE, { variables: {eventId}});
  const purchasedTicketData = data?.yc_event_purchased_tickets;

  useEffect(() => {
    // let unpaid = 0;
    let totalTickets = 0;
    // let totalDinners = 0;
    let noDinner = [];
    let withDinner = [];
    if (loading) return;
    purchasedTicketData.forEach(ticket => {
      totalTickets++;
      // if (ticket.withDinner) totalDinners++;
      // if (ticket.paid === false) unpaid++;
      if (ticket.withDinner === false) {
        noDinner.push(ticket);
      } else {
        withDinner.push(ticket);
      }
    });

    setNodinnerPurchasedTickets([...noDinner])
    setWithDinnerTickets([...withDinner])
    setTicketCount(purchasedTicketData.length)
    setDinnerTicketCount(withDinner.length)
    console.log('purchasedTicketData.length =====', purchasedTicketData.length)
  }, [purchasedTicketData, data]);

  if (loading) return <LoadingYachty isRoot={false} />;

  const eventForPurchase = forPurchaseData?.yc_event_tickets_for_purchase[0];
  const cost = eventForPurchase?.cost;
  const dinnerCost = eventForPurchase?.dinnerCost;
  const ticketId = eventForPurchase?.id;

  const reserveTickets = async () => {    
    if (ticketCount === 0) return;
    let remainingNoDinTickets = [];
    let currentTickets = purchasedTicketData.length;
    let currentDinners = withDinnerTickets.length;
    let removingEventTickets = ticketCount < currentTickets;
    let removingDinners = dinnerTicketCount < currentDinners;
    let addingDinners = dinnerTicketCount > currentDinners;
    let dinnersToRemove = 0;
    let dinnersToAdd = 0;

    console.log('dinner count =======', dinnerTicketCount)
    console.log('current dinners =======', currentDinners)

    if (removingDinners) dinnersToRemove = currentDinners - dinnerTicketCount;
    if (addingDinners) dinnersToAdd = dinnerTicketCount - currentDinners;

    if (removingEventTickets) {
      let numTiksToRemove = currentTickets - ticketCount;
      noDinnerPurchasedTickets.forEach(async ticket => {
        if (numTiksToRemove === 0) {
          return remainingNoDinTickets.push(ticket);
        }
        await deleteEventTicket({
          variables: {
            eventId: ticket.id,
          }
        })
        numTiksToRemove--;
      })
      withDinnerTickets.forEach(async ticket => {
        if (numTiksToRemove === 0) {
          if (dinnersToRemove) {
            await updatePurchasedTicket({
              variables: {
                ticketId,
                withDinner: false,
              }
            })
            dinnersToRemove--
          }
        } else {
          await deleteEventTicket({
            variables: {
              eventId: ticket.id,
            }
          })
          dinnersToRemove--;
        }
      })
    } else {
      console.log('eventForPurchase ================', eventForPurchase)
      let numTiksToAdd = ticketCount - currentTickets;
      while(numTiksToAdd > 0) {
        let withDinner = false;
        if (dinnersToAdd > 0) withDinner = true;
        await insertTickets({
          variables: {
            memberId,
            eventId,
            withDinner,
            ticketForPurchaseId: eventForPurchase.id,
          }
        });
        numTiksToAdd--
        if (dinnersToAdd > 0) dinnersToAdd--
      }
    }
    console.log('here -=========', dinnersToAdd)
    if (dinnersToAdd > 0) {
      noDinnerPurchasedTickets.forEach(async ticket => {
        await updatePurchasedTicket({
          variables: {
            ticketId: ticket.id,
            withDinner: true,
          }
        })
        dinnersToAdd--
      })
    }

    // setTicketCount(0);
    // setDinnerTicketCount(0);
    setShowSuccess(true);
    refetch({
      variables: {
        eventId,
        memberId
      }
    })
  }

  const handleClose = () => {
    // setTicketCount(0);
    setShowSuccess(false);
  };

  const linkEventTicketToRace = async (ticketId) => {
    await linkToRace();
    setEventLinked(true);
  }

  const handleIncrementTicket = () => {
    setTicketCount(ticketCount + 1)
  }

  const handleDecrementTicket = () => {
    setTicketCount(ticketCount - 1)
  }

  const handleIncrementDinnerCount = () => {
    // if (dinnerTicketCount === ticketCount) {
    //   return setFormErrors({...formErrors, tooManyDinTicketsErr: true})
    // }
    setDinnerTicketCount(dinnerTicketCount + 1);
  }

  const handleDecrementDinnerCount = () => {
    if (dinnerTicketCount === 0) {
      return setFormErrors({...formErrors, zeroDinCountCountError: true})
    }
    setDinnerTicketCount(dinnerTicketCount - 1);
  }

  const { totalTickets, totalDinners, unpaid } = purchasedTicketsInfo
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
            <Grid container>

              <Typography sx={{lineHeight: 2.5}} variant='body1'>Event Tickets:</Typography>
              <Grid container justifyContent="space-between">
                <Grid
                  container
                  flexWrap="nowrap"
                  justifyContent="center"
                  sx={{
                    maxWidth: 70,                    
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
                  <IconButton onClick={handleDecrementTicket}>
                    <RemoveIcon color='error' />
                  </IconButton>
                  <IconButton onClick={handleIncrementTicket}>
                    <ControlPointOutlinedIcon color='success' />
                  </IconButton>
                </Grid>
                <Button variant='outlined' size='small'>send</Button>
              </Grid>
            </Grid>
            }

            {!linkToRace &&
              <Grid container>
                <Typography sx={{lineHeight: 2.5}}>Dinner Tickets:</Typography>
                
                <Grid container minWidth={100} justifyContent="space-between" flexWrap="nowrap">
                    <Grid
                      container
                      flexWrap="nowrap"
                      justifyContent="center"
                      sx={{
                        maxWidth: 70,                        
                      }} 
                    >
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
                    <IconButton onClick={handleDecrementDinnerCount}>
                      <RemoveIcon color='error' />
                    </IconButton>
                    <IconButton onClick={handleIncrementDinnerCount}>
                      <ControlPointOutlinedIcon color='success' />
                    </IconButton>
                  </Grid>
                  <Button variant='outlined' size='small'>send</Button>
                </Grid>
              </Grid>
            }
            <Typography variant='body1'>Total for Event: {ticketCount}</Typography>
            <Typography variant='body1'>Total for Dinner: {dinnerTicketCount}</Typography>
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