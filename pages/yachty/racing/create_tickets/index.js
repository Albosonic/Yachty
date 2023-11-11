import EventTicketForPurchase from "@/components/EventTicketForPurchase";
import EventsListMenu from "@/components/EventsListMenu";
import NavBar from "@/components/NavBar";
import RaceTicketForm from "@/components/RaceTIcketForm";
import { GET_RACE_BY_ID } from "@/lib/gqlQueries/racinggql";
import { GET_YC_EVENTS_FEED } from "@/lib/gqlQueries/ycFeedgql";
import { getIsoDate } from "@/lib/utils/getters";
import { useQuery } from "@apollo/client";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";



const CreateRaceEventTickets = () => {
  const router = useRouter()
  const raceId = router.query.raceId;
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [linkedEvent, setLinkedEvent] = useState(null);
  const {error, loading, data} = useQuery(GET_RACE_BY_ID, {variables:{raceId}});  
  const {error: eventError, loading: eventLoading, data: eventData} = useQuery(GET_YC_EVENTS_FEED, {
    variables: {ycId, after: getIsoDate()},
    fetchPolicy: "no-cache",
  });
  
  if (loading|| eventLoading) return <CircularProgress />;
  const race = data.races[0];
  const eventListData = eventData.yc_events;

  return (
    <>
      <NavBar />
      <Stack alignItems="center">
        <RaceTicketForm raceData={race} />
        <Typography variant="h5">Add Event Dinner Ticket</Typography>
        <EventsListMenu eventData={eventListData} setEvent={setLinkedEvent} />
        {linkedEvent && <EventTicketForPurchase eventData={linkedEvent} linkToRace={setLinkedEvent} />}
      </Stack>
    </>
  )
}

export default CreateRaceEventTickets;