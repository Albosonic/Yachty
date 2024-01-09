import { Alert, Box, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Snackbar, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {  useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import { INSERT_RACE_TICKET_FOR_PURCHASE, UPDATE_RACE_TICKET_COST, UPDATE_RACE_W_TICKET_ID } from '@/lib/gqlQueries/racinggql';
import SelectedTimeRange from './SelectedTimeRange';

const RaceTicketForm = ({raceData}) => {
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);

  const [createRaceTicket, { loading: raceTicketLoading }] = useMutation(INSERT_RACE_TICKET_FOR_PURCHASE);
  const [updateTicketCost, {loading: updateTicketLoading}] = useMutation(UPDATE_RACE_TICKET_COST)
  const [updateRace, { loading: raceLoading }] = useMutation(UPDATE_RACE_W_TICKET_ID);

  const [showSuccess, setShowSuccess] = useState(false);
  const [existingRid, setExistingRid] = useState(null);
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(0);

  const moreThan600px = useMediaQuery('(min-width:600px)');

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
    race_tickets_for_purchase: raceTicket,
  } = raceData;

  useEffect(() => {
    const cost = raceTicket ? raceTicket.cost : 0;    
    setAmount(cost);
    setExistingRid(raceTicketId)    
  }, [raceTicketId]);

  const handleCreateRaceTicket = async () => {
    if (existingRid && !editing) {
      return setEditing(true);
    }
    if (editing) {      
      await updateTicketCost({
        variables: {
          ticketId: existingRid,
          cost: amount,
        }
      })
      setShowSuccess(true);
      setEditing(false);
    } else {
      const ticketResp = await createRaceTicket({ variables: { cost: amount, raceId, ycId } });
      const rtid = ticketResp.data.insert_race_tickets_for_purchase.returning[0].id;
      await updateRace({variables: {raceId, raceTicketId: rtid}});
      setExistingRid(rtid);
      setShowSuccess(true);
    }
  }

  const handleClose = () => setShowSuccess(false);

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
          flexDirection: moreThan600px ? 'row': 'column',
          maxWidth: 700,
          margin: '0 auto',
          marginBottom: 5
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: '100%', maxWidth: 320 }}
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
          <Grid display="flex" justifyContent="center" sx={{ '& > :not(style)': { m: 1 }, maxHeight: 70 }}>
          {!moreThan600px &&
            <Fab onClick={handleCreateRaceTicket} size="medium" color='success'  aria-label="add">
              {editing ? <AddIcon /> : <EditIcon />}
            </Fab>
          }
        </Grid>
          <Box
            sx={{              
              width: '100%',
              display: 'flex',
              justifyContent: moreThan600px ? 'flex-end' : 'center',
              pl: 1, pb: 1
            }}>              
            {!editing ? (
              <Grid container direction="row" padding={2} justifyContent={moreThan600px ? 'flex-end' : 'center'}>
                <AttachMoneyIcon color='primary' sx={{alignSelf: 'center', marginLeft: -4}} />
                <Typography variant="h4" >{amount}</Typography>
              </Grid>
            ) : (
              <>
                <AttachMoneyIcon sx={{alignSelf: 'flex-end'}} color='primary' />
                <TextField
                  id="ticket-cost"
                  label="race fee"
                  type="number"
                  variant="standard"
                  multiline
                  sx={{maxWidth: 80}}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </>
              )
            }
          </Box>
        </Box>        
        {moreThan600px &&
          <Fab 
            onClick={handleCreateRaceTicket} 
            size="medium" 
            color='success'  
            aria-label="add"
            sx={{
              width: 90,
              margin: 1
            }}
          >
            {editing ? <AddIcon /> : <CheckIcon/>}
          </Fab>
        }
      </Card>
    </Stack>
  );
}

export default RaceTicketForm;