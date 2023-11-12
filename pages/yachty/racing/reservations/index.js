import EventTicketForPurchase from "@/components/EventTicketForPurchase";
import NavBar from "@/components/NavBar";
import { EVENT_TICKET_FOR_PURCHASE, GET_EVENT_BY_EVENT_ID } from "@/lib/gqlQueries/ycFeedgql";
import { useQuery } from "@apollo/client";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RaceTicketReservations = () => {
  const router = useRouter();
  const raceTicketId = router.query.raceTicketId;
  const eventId = router.query.eventId;
  const {loading, data, error } = useQuery(EVENT_TICKET_FOR_PURCHASE, {variables:{eventId}, fetchPolicy: "no-cache" });
  console.log('eventId: ', eventId);
  console.log('data: ', data);

  if (loading) return <CircularProgress />

  return (
    <>
      <NavBar />
      <Stack spacing={2} alignItems="center">
        <Typography variant="h5">Reserve your Tickets Now</Typography>
        <EventTicketForPurchase eventData={data.yc_events[0]} />
      </Stack>
    </>
  )
}

export default RaceTicketReservations;