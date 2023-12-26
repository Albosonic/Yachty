import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material';
import AllMembersTable from './AllMembersComponent';
import { gql, useQuery } from '@apollo/client';
import LoadingYachty from './LoadingYachty';

const GET_EVENT_ATTENDEES = gql`
  query getEventAttendees($eventId: uuid!) {
  yc_members(where: {yc_event_purchased_tickets: {eventId: {_eq: $eventId}}}) {
    email
    name
    duesOwed
    profilePic
    bio
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
    }
  }
}`;

const columns = [
  { id: 'profilePic', label: 'pic', minWidth: 170 },
  { id: 'dinner', label: 'Dinners', minWidth: 170},
  { id: 'totalTickets', label: 'reservations', minWidth: 170 },
  { id: 'name', label: 'Name', minWidth: 170 },
];
const makeAttendeesFacade = (data) => {
  let totalAttendees = 0;
  let yc_members = data.map(item => {
    const { name, profilePic, yc_event_purchased_tickets: tickets, yc_event_dinner_tickets: dinners } = item;
    let ticketsPaid = 0;
    let ticketsUnPaid = 0;
    let totalTickets = 0;
    let totalDinners = 0;
    tickets.forEach(ticket => {
      ticket.paid ? ticketsPaid++ : ticketsUnPaid++;
      totalTickets++;
    })

    dinners.forEach(dinner => {      
      totalDinners++;
    })

    totalAttendees += totalTickets;
    return { 
      ...item,
      name,      
      profilePic, 
      totalTickets, 
      ticketsPaid, 
      ticketsUnPaid,
      dinner: totalDinners
    };
  })
  return { yc_members, totalAttendees };
}

const EventAttendeeDialog = ({open, setOpenDialog, eventId}) => {
  const { error, loading,  data } = useQuery(GET_EVENT_ATTENDEES, { variables: { eventId, fetchPolicy: 'no-cache' } });
  if (loading) return <LoadingYachty isRoot={false} />
  const membersFacade = makeAttendeesFacade(data.yc_members);  
  const { totalAttendees } = membersFacade;
  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
    >
      <DialogContent>
        {!!totalAttendees && <AllMembersTable columns={columns} data={membersFacade} totalAttendees={membersFacade.totalAttendees} />}
        {!totalAttendees && <Grid container>No Reservations at this time</Grid>}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EventAttendeeDialog;