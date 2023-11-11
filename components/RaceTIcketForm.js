import { Alert, Box, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import {  useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import NavBar from '@/components/NavBar';
import { GET_YC_EVENT, UPSERT_EVENT_TICKET } from '@/lib/gqlQueries/createYCEventgql';
import { INSERT_RACE_TICKET_FOR_PURCHASE } from '@/lib/gqlQueries/racinggql';
import SelectedTimeRange from './SelectedTimeRange';

const RaceTicketForm = ({raceData}) => {
  console.log('race ====:', raceData)
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [createRaceTicket, { loading: raceTicketLoading, data: raceTicketData, error: raceTicketError }] = useMutation(INSERT_RACE_TICKET_FOR_PURCHASE);
  const [amount, setAmount] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
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
  } = raceData;
  console.log('wtfwtfw ==', raceData)
  const handleCreateRaceTicket = async () => {
    let variables = {
      cost: amount,
      raceId,
      ycId,
    }
    await createRaceTicket({ variables });
    setShowSuccess(true);
  }

  const handleClose = () => {
    // router.push({ pathname: '/yachty', query: { ycId } })
    console.log('closed doing nothing');
    setShowSuccess(false);
  }; 

  return (
    <>
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
        </CardContent>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', pl: 1, pb: 1 }}>
          <AttachMoneyIcon color='action' sx={{color: 'black', fontSize: "40px", marginTop: 1}} />
          <Typography sx={{color: 'black', fontSize: "40px", marginRight: 1}}>{ amount }</Typography>
        </Box>
      </Box>
      <Box display="flex" sx={{ '& > :not(style)': { m: 1 } }}>
        <Fab onClick={handleCreateRaceTicket} size="medium" color='success'  aria-label="add">
          <AddIcon />
        </Fab>
      </Box>
    </Card>
    <Grid container display="flex" direction="row" justifyContent="center" sx={{marginTop: 0}}>
      <TextField
        id="ticket-cost"
        label="Enter Cost"
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => setAmount(e.target.value)}
      />
    </Grid>
    </>
  );
}

export default RaceTicketForm;