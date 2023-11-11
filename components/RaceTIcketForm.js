import { useRouter } from 'next/router';
import { Alert, Box, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Snackbar, Stack, TextField, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {  useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import NavBar from '@/components/NavBar';
import { GET_YC_EVENT, UPSERT_EVENT_TICKET } from '@/lib/gqlQueries/createYCEventgql';
import { INSERT_RACE_TICKET_FOR_PURCHASE, UPDATE_RACE_W_TICKET_ID } from '@/lib/gqlQueries/racinggql';
import SelectedTimeRange from './SelectedTimeRange';

const RaceTicketForm = ({raceData}) => {
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [createRaceTicket, { loading: raceTicketLoading }] = useMutation(INSERT_RACE_TICKET_FOR_PURCHASE);
  const [updateRace, { loading: raceLoading }] = useMutation(UPDATE_RACE_W_TICKET_ID);
  const [amount, setAmount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingRid, setExistingRid] = useState(null);

  const {
    endDate,
    startDate,
    eventId,
    hours,
    id: raceId,
    img: image,
    raceCourseId,
    raceName,
    startTime,
    endTime,
    raceTicketId,
    race_tickets_for_purchase: { cost },
  } = raceData;

  useEffect(() => {
    setAmount(cost);
    setExistingRid(raceTicketId)
  }, [raceTicketId]);

  const handleCreateRaceTicket = async () => {


    const ticketResp = await createRaceTicket({ variables: { cost: amount, raceId, ycId } });
    const rtid = ticketResp.data.insert_race_tickets_for_purchase.returning[0].id;
    console.log('ticketResp.data.race_tickets_for_purchase:', ticketResp.data.insert_race_tickets_for_purchase.returning[0].id)

    await updateRace({variables: {raceId, raceTicketId: rtid}});

    setExistingRid(rtid);
    setShowSuccess(true);
  }

  const handleClose = () => {
    // router.push({ pathname: '/yachty', query: { ycId } })
    console.log('closed doing nothing');
    setShowSuccess(false);
  };
  console.log('existing Id', existingRid)
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
            <SelectedTimeRange startDate={startDate + startTime} endDate={endDate + endTime} />
            {existingRid && <Typography variant="h5" sx={{color: 'green', transform: "rotate(-30deg)"}}>You're all set!</Typography>}
          </CardContent>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', pl: 1, pb: 1 }}>
            {existingRid ? (
              <Grid container justifyContent="flex-end">
                <AttachMoneyIcon color='action' sx={{color: 'black', fontSize: "40px"}} />
                <Typography variant="h4" sx={{lineHeight: -1}} >{amount}</Typography>
              </Grid>
            ) : (
              <>
                <AttachMoneyIcon color='action' sx={{color: 'black', fontSize: "40px", marginTop: 1}} />
                <TextField
                  id="ticket-cost"
                  label="Cost"
                  type="number"
                  variant="standard"
                  multiline
                  sx={{
                    maxWidth: 80,
                    marginRight: -5,

                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </>
              )
            }
          </Box>
        </Box>
        <Box display="flex" sx={{ '& > :not(style)': { m: 1 }, maxHeight: 70 }}>
          <Fab onClick={handleCreateRaceTicket} size="medium" color='success'  aria-label="add">
            {existingRid ? <CheckIcon/> : <AddIcon />}
          </Fab>
        </Box>
      </Card>
    </Stack>
  );
}

export default RaceTicketForm;