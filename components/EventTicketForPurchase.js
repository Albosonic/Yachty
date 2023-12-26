import { useMutation, useQuery } from '@apollo/client';
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
import { DELETE_DINNER_TICKETS, DELETE_EVENT_TICKET, GET_EVENT_TICKET_FOR_PURCHASE, GET_PURCHASED_DINNER_TICKETS_BY_IDS, GET_PURCHASED_EVENT_TICKETS_BY_IDS, INSERT_DINNER_TICKETS, INSERT_PURCHASED_TICKETS, UPDATE_PURCHASED_TICKET } from '@/lib/gqlQueries/ticketsGQL';

const EventTicketForPurchase = ({ eventData, linkToRace }) => {
  const memberId = useSelector(state => state.auth.member.id );
  const [formErrors, setFormErrors] = useState({ tooManyDinTicketsErr: false })
  const [ticketCount, setTicketCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dinnerTicketCount, setDinnerTicketCount] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false);
  const [eventLinked, setEventLinked] = useState(false);

  const [insertTickets, {loading: insertLoading}] = useMutation(INSERT_PURCHASED_TICKETS);
  const [deleteEventTickets, {loading: deleteLoading}] = useMutation(DELETE_EVENT_TICKET);
  const [insertDinnerTickets, {loading: dinnerInsertLoading}] = useMutation(INSERT_DINNER_TICKETS);
  const [deleteDinners, {loading: deleteDinnerLoading}] = useMutation(DELETE_DINNER_TICKETS);
  const {tooManyDinTicketsErr} = formErrors;

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
  const {error: errorDinners, loading: dinnersLoading, data: dinnersData, refetch: refetchDinners} = useQuery(GET_PURCHASED_DINNER_TICKETS_BY_IDS, {
    fetchPolicy: 'no-cache',
    variables: {
      eventId,
      memberId
    }
  });
  const {error: forPurchaseError, loading: forPurchaseLoading, data: forPurchaseData} = useQuery(GET_EVENT_TICKET_FOR_PURCHASE, { 
    variables: {eventId}
  });
  const purchasedTicketData = data?.yc_event_purchased_tickets;
  const purchasedDinnersData = dinnersData?.yc_event_dinner_tickets;

  useEffect(() => {
    if (loading || dinnersLoading) return;

    setTicketCount(purchasedTicketData.length)
    setDinnerTicketCount(purchasedDinnersData.length)    
  }, [data, dinnersData]);

  if (loading) return <LoadingYachty isRoot={false} />;

  const eventForPurchase = forPurchaseData?.yc_event_tickets_for_purchase[0];
  const cost = eventForPurchase?.cost;
  const dinnerCost = eventForPurchase?.dinnerCost;  

  const handleSendTickets = async () => {
    if (tooManyDinTicketsErr) setFormErrors({...formErrors, tooManyDinTicketsErr: false})
    let insertTicketObjects = [];    
    const currentTickets = purchasedTicketData.length;
    if (ticketCount > currentTickets) {
      let ticketsToAdd = ticketCount - currentTickets;
      for (let i = 0; i < ticketsToAdd; i++) {
        insertTicketObjects.push({
          memberId,
          eventId,
          ticketForPurchaseId: eventForPurchase.id,
        })
      }
      await insertTickets({
        variables: {
          objects: insertTicketObjects
        }
      });
    } else if (currentTickets > ticketCount) {
      let ticketsToDelete = currentTickets - ticketCount;
      let ticketIds = [];
      for (let i = 0; i < ticketsToDelete; i++) {
        ticketIds.push(purchasedTicketData[i].id)
      }            
      const resp = await deleteEventTickets({
        variables: {
          ids: ticketIds
        }
      })      
    }
    await refetch({
      variables: {
        eventId,
        memberId
      }
    })
  }

  const handleSendDinners = async () => {    
    let insertDinnerObjects = [];    
    const currentDinners = purchasedDinnersData.length;
    if (dinnerTicketCount > currentDinners) {
      let ticketsToAdd = dinnerTicketCount - currentDinners;
      for (let i = 0; i < ticketsToAdd; i++) {
        insertDinnerObjects.push({
          memberId,
          eventId,
          ticketForPurchaseId: eventForPurchase.id,
        })
      }
      await insertDinnerTickets({
        variables: {
          objects: insertDinnerObjects
        }
      });
    } else if (currentDinners > dinnerTicketCount) {
      let dinneersToDelete = currentDinners - dinnerTicketCount;
      let dinnerIds = [];
      let dinnersPaidFor = [];
      for (let i = 0; i < dinneersToDelete; i++) {
        if (purchasedDinnersData[i].paid) {
          dinnersPaidFor.push(purchasedDinnersData[i])
        } else {
          dinnerIds.push(purchasedDinnersData[i].id)
        }
      }            
      const resp = await deleteDinners({
        variables: {
          ids: dinnerIds
        }
      })      
      console.log('dinnerTickets ==resp===', resp)
    }
    await refetchDinners({
      variables: {
        eventId,
        memberId
      }
    })

  }

  const handleClose = () => {    
    setShowSuccess(false);
  };

  const linkEventTicketToRace = async (ticketId) => {
    await linkToRace();
    setEventLinked(true);
  }

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
              <Typography sx={{lineHeight: 2.5}} variant='h6'>Event Tickets: {ticketCount}</Typography>
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
                  <IconButton onClick={() => setTicketCount(ticketCount - 1)}>
                    <RemoveIcon color='error' />
                  </IconButton>
                  <IconButton onClick={() => setTicketCount(ticketCount + 1)}>
                    <ControlPointOutlinedIcon color='success' />
                  </IconButton>
                </Grid>
                <Button onClick={handleSendTickets} variant='outlined' size='small'>send</Button>
              </Grid>
            </Grid>
            }

            {!linkToRace &&
              <Grid container>
                <Typography variant='h6' sx={{lineHeight: 2.5}}>Dinner Tickets: {dinnerTicketCount}</Typography>
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
                    <IconButton onClick={() => setDinnerTicketCount(dinnerTicketCount - 1)}>
                      <RemoveIcon color='error' />
                    </IconButton>
                    <IconButton 
                      onClick={() => {
                        if (dinnerTicketCount === ticketCount) return setFormErrors({...formErrors, tooManyDinTicketsErr: true})
                        setDinnerTicketCount(dinnerTicketCount + 1)
                      }}
                    >
                      <ControlPointOutlinedIcon color='success' />
                    </IconButton>
                  </Grid>
                  <Button onClick={handleSendDinners} variant='outlined' size='small'>send</Button>
                </Grid>
                {tooManyDinTicketsErr && <Typography color="error">can't have more dinners than event tickets</Typography>}
              </Grid>
            }
            {/* <Typography variant='body1'>Total for Event: {ticketCount}</Typography>
            <Typography variant='body1'>Total for Dinner: {dinnerTicketCount}</Typography> */}
            <Grid container>
              {/* <Typography sx={{lineHeight: 2.5}} variant='body1'>unpaid: {unpaid}</Typography> */}
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
            {/* <Stack spacing={2} alignItems="center">
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
            </Stack> */}
          </Stack>
        )}
      </Card>
    </Stack>
  )
}

export default EventTicketForPurchase;