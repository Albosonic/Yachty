import { gql, useMutation, useQuery } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { Alert, Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Snackbar, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import {  useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SelectedTimeRange from './SelectedTimeRange';
import { GET_RACE_TICKET_RESERVATION } from '@/lib/gqlQueries/racinggql';
import LoadingYachty from './LoadingYachty';

const INSERT_PURCHASED_TICKETS = gql`
  mutation insertPurchasedTickets($ticketForPurchaseId: uuid!, $raceId: uuid!, $ycId: uuid!, $memberId: uuid!) {
  insert_race_tickets_purchased(objects: {raceTicketId: $ticketForPurchaseId, ycId: $ycId, raceId: $raceId, memberId: $memberId}) {
    returning {
      ycId
      raceTicketId
      raceId
      memberId
      id
    }
  }
}`;

const GET_RACE_TICKET = gql`
  query getRaceTicket($raceId: uuid!) {
  race_tickets_for_purchase(where: {raceId: {_eq: $raceId}}) {
    cost
    id
  }
}
`

const RaceTicketsForPurchase = ({ raceData }) => {

  const {
    raceName,
    img: image,
    id: raceId,
    startDate,
    startTime,
    endDate,
    endTime,
  } = raceData[0];

  const memberId = useSelector(state => state.auth.member.id);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [insertTickets, {error: insertError, loading: insertLoading, data: insertData}] = useMutation(INSERT_PURCHASED_TICKETS);
  const [ticketReserved, setTicketReserved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const moreThan600px = useMediaQuery('(min-width:600px)');

  const {error: resError, loading: resLoading, data: resData} = useQuery(GET_RACE_TICKET_RESERVATION, {
    variables: {raceId, memberId},
    fetchPolicy: 'no-cache',
  })

  const {error: ticketError, loading: ticketLoading, data: ticketData} = useQuery(GET_RACE_TICKET, {
    variables: {raceId}
  })

  useEffect(() => {
    const reservedRaceTicket = resData?.race_tickets_purchased;
    if (Array.isArray(reservedRaceTicket)) {
      setTicketReserved(reservedRaceTicket.length > 0);
    }
  },[resData])

  if (!raceData || resLoading || ticketLoading) return <LoadingYachty />;
  
  const {cost, id: ticketForPurchaseId} = ticketData.race_tickets_for_purchase[0];

  const reserveTicket = async () => {
    await insertTickets({variables: { memberId, ticketForPurchaseId, raceId, ycId }});
    setTicketCount(0);
    setShowSuccess(true);
    setTicketReserved(true);
  }

  const handleClose = () => {
    setTicketCount(0);
    setShowSuccess(false)
  };

  const cardWidthMin = moreThan600px ? 700 : 200;
  const cardWidthMax = moreThan600px ? 200 : 700;
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
          minWidth: cardWidthMin,
          maxWidth: cardWidthMax,
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
            <SelectedTimeRange startDate={startDate + startTime} endDate={endDate + endTime} />
            <Grid container display="flex" direction="row" justifyContent="center" sx={{marginTop: 2}}>
              {ticketReserved && <Typography variant="h5" sx={{color: 'green', transform: "rotate(-30deg)"}}>You're all set!</Typography>}
              {ticketCount > 0 && <Button onClick={reserveTicket}>Confirm</Button>}
            </Grid>
          </CardContent>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', pl: 1, pb: 1 }}>
            <AttachMoneyIcon color='action' sx={{color: 'black', fontSize: "40px", marginTop: 1}} />
            <Typography sx={{color: 'black', fontSize: "40px", marginRight: 1}}>{ cost }</Typography>
          </Box>
        </Box>
        <Stack alignItems="center" sx={{ '& > :not(style)': { m: 1 } }}>
          {!ticketReserved &&
          <Fab onClick={() => setTicketCount(1)} size="medium" color='success'  aria-label="add">
            <AddIcon />
          </Fab>          }
        </Stack>
      </Card>
    </Stack>
  )
}

export default RaceTicketsForPurchase;