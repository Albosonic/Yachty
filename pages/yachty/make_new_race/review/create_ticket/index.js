import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { CircularProgress, Fab, Grid, Stack, Typography } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventTicketForPurchase from "@/components/EventTicketForPurchase";
import EventsListMenu from "@/components/EventsListMenu";
import NavBar from "@/components/NavBar";
import RaceTicketForm from "@/components/RaceTIcketForm";
import { GET_RACE_BY_ID, LINK_EVENT_TO_RACE } from "@/lib/gqlQueries/racinggql";
import { GET_YC_EVENTS_FEED } from "@/lib/gqlQueries/ycFeedgql";
import { getIsoDate } from "@/lib/utils/getters";

const CreateRaceEventTickets = () => {
  const router = useRouter()
  const raceId = router.query.raceId;
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [chosenEventToLink, setChosenEventToLink] = useState(null);
  const {error, loading, data, refetch: refetchRace} = useQuery(GET_RACE_BY_ID, {
    variables: { raceId }
  });  
  const {error: eventError, loading: eventLoading, data: eventData} = useQuery(GET_YC_EVENTS_FEED, {
    variables: {ycId, after: getIsoDate()},
    fetchPolicy: "no-cache",
  });

  const [linkToRace, {loading: linkLoading}] = useMutation(LINK_EVENT_TO_RACE);

  if (loading|| eventLoading || raceId === undefined) return <CircularProgress />;

  const goBack = () => {
    router.replace({
      pathname: '/yachty/dashboard',
    })
  }

  const done = () => {
    router.replace({
      pathname: '/yachty',
    })
  }

  const linkEventDinnerToRace = async () => {
    await linkToRace({variables: {raceId, eventId: chosenEventToLink.id}});
    await refetchRace();
  }

  const race = data.races[0];  
  const eventListData = eventData.yc_events;

  return (
    <>
      <NavBar />
      <Stack alignItems="center">
        <Grid  container justifyContent="space-between">
          {/* <Fab size="medium" onClick={goBack} variant="extended" sx={{ margin: 3 }} color="primary">
            <ArrowBackIcon /> Back
          </Fab> */}
          <Fab size="medium" onClick={done} variant="extended" sx={{ margin: 3, alignSelf: 'flex-end' }} color="primary">
            <DoneIcon /> Done
          </Fab>
        </Grid>
        <RaceTicketForm raceData={race} />
        {eventListData.length > 0 && <Typography variant="h5">Add Event Dinner Ticket</Typography>}
        {eventListData.length > 0 && <EventsListMenu eventData={eventListData} setEvent={setChosenEventToLink} />}
        {chosenEventToLink && <EventTicketForPurchase eventData={chosenEventToLink} linkToRace={linkEventDinnerToRace} raceId={raceId} linked={!!race.eventId} />}
      </Stack>
    </>
  )
}

export default CreateRaceEventTickets;