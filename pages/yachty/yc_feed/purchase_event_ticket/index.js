import EventTicketForPurchase from "@/components/EventTicketForPurchase"
import NavBar from "@/components/NavBar";
import { EVENT_TICKET_FOR_PURCHASE } from "@/lib/gqlQueries/ycFeedgql";
import { useQuery } from "@apollo/client";
import { CircularProgress, Stack } from "@mui/material";
import { useRouter } from "next/router";

const YcEventTicketForPurchase = () => {
  const router = useRouter();
  const eventId = router.query.eventId;
  const {loading, data, error } = useQuery(EVENT_TICKET_FOR_PURCHASE, {variables:{eventId}, fetchPolicy: "no-cache" });
  console.log('data ===>', data);
  console.log('eventId ===>', eventId);
  console.log('loading ===>', loading);
  if (loading || data === undefined) return <CircularProgress />
  const eventData = data.yc_events[0];
  return (
    <>
      <NavBar />
      <Stack alignItems="center" >
        <EventTicketForPurchase eventData={eventData} />
      </Stack>
    </>
  )
}

export default YcEventTicketForPurchase;