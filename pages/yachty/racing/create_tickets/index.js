import EventTicketForPurchase from "@/components/EventTicketForPurchase";
import EventsListMenu from "@/components/EventsListMenu";
import NavBar from "@/components/NavBar";
import RaceTicketForm from "@/components/RaceTIcketForm";
import { useSelector } from "react-redux";
import { GET_RACE_BY_ID, LINK_EVENT_TO_RACE } from "@/lib/gqlQueries/racinggql";
import { GET_YC_EVENTS_FEED } from "@/lib/gqlQueries/ycFeedgql";
import { getIsoDate } from "@/lib/utils/getters";
import { useMutation, useQuery } from "@apollo/client";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

const CreateRaceEventTickets = () => {
  const router = useRouter()
  const raceId = router.query.raceId;
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [chosenEventToLink, setChosenEventToLink] = useState(null);
  const {error, loading, data, refetch: refetchRace} = useQuery(GET_RACE_BY_ID, {variables:{raceId}});  
  const {error: eventError, loading: eventLoading, data: eventData} = useQuery(GET_YC_EVENTS_FEED, {
    variables: {ycId, after: getIsoDate()},
    fetchPolicy: "no-cache",
  });
  // TODO: tickets created and then ad edit or delete funcionality
  const [linkToRace, {loading: linkLoading}] = useMutation(LINK_EVENT_TO_RACE);

  if (loading|| eventLoading) return <CircularProgress />;
  const linkEventDinnerToRace = async () => {
    await linkToRace({variables: {raceId, eventId}});
    await refetchRace();

  }
  const race = data.races[0];
  const eventListData = eventData.yc_events;

  return (
    <>
      <NavBar />
      <Stack alignItems="center">
        <RaceTicketForm raceData={race} />
        <Typography variant="h5">Add Event Dinner Ticket</Typography>
        <EventsListMenu eventData={eventListData} setEvent={setChosenEventToLink} />
        {chosenEventToLink && <EventTicketForPurchase eventData={chosenEventToLink} linkToRace={linkEventDinnerToRace} raceId={raceId} />}
      </Stack>
    </>
  )
}

export default CreateRaceEventTickets;