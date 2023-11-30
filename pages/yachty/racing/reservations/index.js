import EventTicketForPurchase from "@/components/EventTicketForPurchase";
import NavBar from "@/components/NavBar";
import RaceTicketsForPurchase from "@/components/RaceTicketsForPurchase";
import { GET_RACE_BY_ID } from "@/lib/gqlQueries/racinggql";
import { EVENT_TICKET_FOR_PURCHASE, GET_EVENT_BY_EVENT_ID } from "@/lib/gqlQueries/ycFeedgql";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useQuery } from "@apollo/client";
import { CircularProgress, Fab, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";

const RaceTicketReservations = () => {
  const router = useRouter();
  const raceId = router.query.raceId;
  const eventId = router.query.eventId;
  const {loading, data, error } = useQuery(EVENT_TICKET_FOR_PURCHASE, {variables:{eventId}, fetchPolicy: "no-cache" });
  const {loading: raceErrror, data: raceData, error: errorLoading } = useQuery(GET_RACE_BY_ID, { variables: { raceId: raceId }});
  
  if (loading || raceId === undefined || !raceData) return <CircularProgress />
  const race = raceData?.races;
  return (
    <>
      <NavBar />
      <Stack spacing={2} alignItems="center">        
        <Grid width="100%">
          <Fab size="small" sx={{margin: 2}} color="primary" variant="extended" onClick={() => router.back()}>
            <ArrowBack/>
            Back
          </Fab>
        </Grid>
        <Typography variant="h5">Reserve your Tickets Now</Typography>
        <RaceTicketsForPurchase raceData={race} />
        {data.yc_events && <EventTicketForPurchase eventData={data.yc_events[0]} />}
      </Stack>
    </>
  )
}

export default RaceTicketReservations;