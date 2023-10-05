import NavBar from "@/components/NavBar";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";

const GET_EVENT_RESERVATIONS = gql`
  query getYcEventReservations($eventId: uuid!){
  yc_event_purchased_tickets(where: {event_id: {_eq: $eventId}}) {
    id
    memberId
    ticketForPurchaseId
    paid
    yc_member {
      name
    }
    yc_event_tickets_for_purchase {
      yc_event {
        event_name
        image
      }
    }
  }
}`;

const SeeEventReservations = (props) => {
  const router = useRouter();
  const eventId = router.query.eventId;
  const { error, loading, data } = useQuery(GET_EVENT_RESERVATIONS, { variables: { eventId, fetchPolicy: 'no-cache' }});
  if (loading) return <CircularProgress />
  console.log('data :', data)
  return (
    <>
      <NavBar/>
      <Typography>
        Members table: includes how many tickets, and paid or not paid.
      </Typography>
    </>
  )
}

export default SeeEventReservations;