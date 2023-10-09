import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { CircularProgress, Fab, ListItemButton, Paper, Typography } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import CheckIcon from '@mui/icons-material/Check';
import NavBar from "@/components/NavBar";

const GET_EVENT_RESERVATIONS = gql`
  query getYcEventReservations($eventId: uuid!){
    yc_event_purchased_tickets(where: {eventId: {_eq: $eventId}}) {
    id
    memberId
    ticketForPurchaseId
    paid
    yc_member {
      name
    }
    yc_event {
      event_name
      image
    }
  }
}`;

const UPDATE_RESERVATION_PAYMRENT = gql`
  mutation updateReservationPayment($id: uuid, $paid: boolean) {
  update_yc_event_purchased_tickets(where: {id: {_eq: $id}}, _set: {paid: true}) {
    returning {
      paid
    }
  }
}`;

const useReservationsFacade = () => {
  const [ticketPaid, {loading: paidLoading}] = useMutation(UPDATE_RESERVATION_PAYMRENT, {variables: {id: '', paid: false}});
  const router = useRouter();
  const eventId = router.query.eventId;
  const { error, loading, data, refetch } = useQuery(GET_EVENT_RESERVATIONS, { variables: { eventId }, fetchPolicy: "no-cache" });
  if (loading) return {loading: true, data: false, error};
  let facade = data.yc_event_purchased_tickets.map(reservation => {
    return {
      id: reservation.id,
      paid: reservation.paid,
      memberName: reservation.yc_member.name,
      eventName: reservation.yc_event.event_name,
      eventImage: reservation.yc_event.image,
      payForRes: async (id) => {
        await ticketPaid({ variables: { paid: true, id: id } })
        refetch();
      }
    }
  })

  return {loading, facade, error};
}

const SeeEventReservations = (props) => {
  const { user } = useUser();
  const {loading, facade, error} = useReservationsFacade();

  if (loading) return <CircularProgress />
  
  return (
    <>
      <NavBar/>
        <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper', margin: '0 auto' }}>
        {facade.map(reservation => {
          console.log('res: ', reservation);
          const {id, paid, memberName, eventName, eventImage, payForRes} = reservation;
          console.log('id', id);
          return (
            <Paper elevation={2} sx={{margin: 2, padding: 2, width: '100%'}}>
              <ListItem sx={{width: '100%'}}>
                <ListItemAvatar>
                  <Avatar src={eventImage}>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={memberName}/>
                <ListItemText primary={eventName}/>
                <ListItemText sx={{marginLeft: 1}} primary={paid ? 'paid' : 'pay now'}/>
                {!paid && <ListItemButton onClick={() => payForRes(id)}>
                  <Fab color="success" aria-label="add">
                    <CheckIcon />
                  </Fab>
                </ListItemButton>}
              </ListItem>
            </Paper>
          )
        })}
      </List>
    </>
  )
}

export default SeeEventReservations;
