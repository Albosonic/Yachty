import EventTicketForPurchase from "@/components/EventTicketForPurchase";
import NavBar from "@/components/NavBar";
import RaceTicketsForPurchase from "@/components/RaceTicketsForPurchase";
import { GET_RACE_BY_ID } from "@/lib/gqlQueries/racinggql";
import { EVENT_TICKET_FOR_PURCHASE, GET_EVENT_BY_EVENT_ID } from "@/lib/gqlQueries/ycFeedgql";
import { useQuery } from "@apollo/client";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

const RaceTicketReservations = () => {
  const router = useRouter();
  const raceId = router.query.raceId;
  const eventId = router.query.eventId;
  const {loading, data, error } = useQuery(EVENT_TICKET_FOR_PURCHASE, {variables:{eventId}, fetchPolicy: "no-cache" });
  
  const {loading: raceErrror, data: raceData, error: errorLoading } = useQuery(GET_RACE_BY_ID, { variables: { raceId: raceId }});
  
  if (loading || raceId === undefined) return <CircularProgress />
  const races = raceData?.races;
  return (
    <>
      <NavBar />
      <Stack spacing={2} alignItems="center">
        <Typography variant="h5">Reserve your Tickets Now</Typography>
        <RaceTicketsForPurchase raceData={races} />
        <EventTicketForPurchase eventData={data.yc_events[0]} />
      </Stack>
    </>
  )
}

export default RaceTicketReservations;