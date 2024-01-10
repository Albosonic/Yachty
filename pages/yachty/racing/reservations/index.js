import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import RaceTicketsForPurchase from "@/components/RaceTicketsForPurchase";
import { Fab, Grid, Stack, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import DoneIcon from '@mui/icons-material/Done';
import { useQuery } from "@apollo/client";
import { GET_RACE_BY_ID } from "@/lib/gqlQueries/racinggql";
import { EVENT_TICKET_FOR_PURCHASE } from "@/lib/gqlQueries/ycFeedgql";
import EventTicketForPurchase from "@/components/EventTicketForPurchase";
import LoadingYachty from "@/components/LoadingYachty";

const RaceTicketReservations = () => {
  const router = useRouter();
  const raceId = router.query.raceId;
  const eventId = router.query.eventId;
  const {loading, data, error } = useQuery(EVENT_TICKET_FOR_PURCHASE, {variables:{eventId}, fetchPolicy: "no-cache" });
  const {loading: raceErrror, data: raceData, error: errorLoading } = useQuery(GET_RACE_BY_ID, { variables: { raceId: raceId }});
  
  if (loading || raceId === undefined || !raceData) return <LoadingYachty />
  const race = raceData?.races;

  const done = () => {
    router.replace({
      pathname: '/yachty',
    })
  }

  return (
    <>
      <NavBar />
      <Stack spacing={2} sx={{marginBottom: 10}} alignItems="center">        
        <Grid container width="100%" justifyContent="space-between">
          <Fab size="medium" sx={{margin: 2}} color="primary" variant="extended" onClick={() => router.back()}>
            <ArrowBack/>
            Back
          </Fab>
          <Fab size="medium" onClick={done} variant="extended" sx={{ margin: 2 }} color="primary">
            <DoneIcon /> Done
          </Fab>
        </Grid>
        <Typography variant="h5">Reserve your Tickets Now</Typography>
        <RaceTicketsForPurchase raceData={race} />
        {data?.yc_events && <EventTicketForPurchase eventData={data.yc_events[0]} />}
      </Stack>
    </>
  )
}

export default RaceTicketReservations;