import { useRouter } from "next/router";
import { Box, CircularProgress, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_YC_EVENTS_FEED } from "@/lib/gqlQueries/ycFeedgql";
import NavBar from "@/components/NavBar";
import YcEventPoster from "@/components/YcEventPoster";
import { useSelector } from "react-redux";

const YachtClubFeed = () => {
  const router = useRouter();
  const ycId = router.query.ycId;
  // TODO: useIsoDateUtils instead
  const date = new Date();
  const dateIso = date.toISOString().slice(0, 10);
  const variables = {ycId, after: dateIso };
  const {error, loading, data} = useQuery(GET_YC_EVENTS_FEED, { variables, fetchPolicy: "no-cache" });
  const yachtClubName = useSelector(state => state.auth.member.yachtClubByYachtClub.name);
  const moreThan600px = useMediaQuery('(min-width:600px)');

  if (loading) return <CircularProgress />
  const events = data?.yc_events;
  return (
    <>
      <NavBar />
      <Grid container justifyContent="center">
      <Typography noWrap sx={{padding: 1}} variant="h4">{ yachtClubName }</Typography>
        <Typography noWrap sx={{padding: 1}} variant="h4">Upcoming Events</Typography>
      </Grid>
      <Stack spacing={2} alignItems="center">
        {events.map((event, index) => <YcEventPoster eventData={event} key={`${event.event_name}${index}`} />)}
      </Stack>
    </>
  )
};

export default YachtClubFeed;

// sx={{
//   mb: 2,
//   display: "flex",
//   flexDirection: "column",
//   // maxWidth: 600,
//   height: 700,
//   overflow: "hidden",
//   overflowY: "scroll",
// }}