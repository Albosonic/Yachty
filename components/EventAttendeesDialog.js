import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material';
import AllMembersTable from './AllMembersComponent';
import { gql, useQuery } from '@apollo/client';
import LoadingYachty from './LoadingYachty';
import AttendeesTable from './tablesYachty/AttendeesTable';
import { useEffect, useState } from 'react';

const GET_EVENT_ATTENDEES = gql`
  query getEventAttendees($eventId: uuid!) {
  yc_members(where: {yc_event_purchased_tickets: {eventId: {_eq: $eventId}}}) {
    email
    name
    duesOwed
    profilePic
    bio
    id
    vessels {
      vesselName
      hullMaterial
      sailNumber
      specialNotes
      type
      make
      model
      length
      beam
      draft
      marina
      slip
      img
    }
    yc_event_purchased_tickets(where: {eventId: {_eq: $eventId}}) {
      paid
    }
    yc_event_dinner_tickets(where: {eventId: {_eq: $eventId}}) {
      id
      paid
    }
  }
}`;

const columns = [
  { id: 'profilePic', label: 'Picture', minWidth: 80 },
  { id: 'totalTickets', label: 'RSVP', minWidth: 80 },  
  { id: 'totalDinners', label: 'Dinners', minWidth: 80},  
];

const makeAttendeesFacade = (data) => {
  let totalAttendees = 0;
  let totalAttendeeDinners = 0;
  let yc_members = data.map(item => {
    const {
      id, 
      name, 
      profilePic, 
      yc_event_purchased_tickets: tickets, 
      yc_event_dinner_tickets: dinners 
    } = item;
    let ticketsPaid = 0;    
    let ticketsUnPaid = 0;
    let totalTickets = 0;
    let totalDinners = 0;
    let dinnersPaid = 0;
    let dinnersUnpaid = 0;

    tickets.forEach(ticket => {
      ticket.paid ? ticketsPaid++ : ticketsUnPaid++;
      totalTickets++;
    })

    dinners.forEach(dinner => {      
      dinner.paid ? dinnersPaid++ : dinnersUnpaid++;
      totalDinners++;
    })

    totalAttendees = totalTickets;
    totalAttendeeDinners = totalDinners;

    return { 
      ...item,
      targetMemberId: id,
      memberName: name,
      memberPic: profilePic, 
      totalTickets,
      ticketsPaid, 
      ticketsUnPaid,
      dinnersPaid,
      dinnersUnpaid,
      totalDinners,      
    };
  })
  return { yc_members, totalAttendees, totalAttendeeDinners };
}

const EventAttendeeDialog = ({open, setOpenDialog, eventId}) => {
  const { error, loading,  data } = useQuery(GET_EVENT_ATTENDEES, { variables: { eventId, fetchPolicy: 'no-cache' } });
  const [membersFacade, setMembersFacade] = useState({});
  useEffect(() => {
    if (loading) return;
    setMembersFacade(makeAttendeesFacade(data.yc_members))
  }, [data])

  if (loading) return <LoadingYachty isRoot={false} />
  const { totalAttendees, totalAttendeeDinners } = membersFacade;
  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
    >
      <DialogContent>
        {!!totalAttendees && 
          <AttendeesTable 
            columns={columns} 
            data={membersFacade} 
            totalAttendees={totalAttendees} 
            totalAttendeeDinners={totalAttendeeDinners}
          />}
        {!totalAttendees && <Grid container>No Reservations at this time</Grid>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EventAttendeeDialog;