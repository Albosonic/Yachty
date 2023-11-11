import EventTicketForPurchase from "@/components/EventTicketForPurchase"
import NavBar from "@/components/NavBar";
import { EVENT_TICKET_FOR_PURCHASE } from "@/lib/gqlQueries/ycFeedgql";
import { useRouter } from "next/router";

const YcEventTicketForPurchase = () => {
  const router = useRouter();
  const eventId = router.query.eventId;
  const {loading, data, error } = useQuery(EVENT_TICKET_FOR_PURCHASE, {variables:{eventId}, fetchPolicy: "no-cache" });
  if (loading) return <CircularProgress />
  const eventData = yc_events[0];
  return (
    <>
      <NavBar />
      <EventTicketForPurchase eventData={eventData} />
    </>
  )
}

export default YcEventTicketForPurchase;