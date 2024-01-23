import { useRouter } from "next/router";
import { Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_YC_EVENTS_FEED } from "@/lib/gqlQueries/ycFeedgql";
import NavBar from "@/components/NavBar";
import YcEventPoster from "@/components/YcEventPoster";
import { useSelector } from "react-redux";
import LoadingYachty from "@/components/LoadingYachty";

const YachtClubFeed = () => {
  const router = useRouter();
  const ycId = router.query.ycId;
  const date = new Date();
  const dateIso = date.toISOString().slice(0, 10);
  const variables = {ycId, after: dateIso };
  const {error, loading, data} = useQuery(GET_YC_EVENTS_FEED, { variables, fetchPolicy: "no-cache" });
  const yachtClubName = useSelector(state => state.auth.member.yachtClubByYachtClub.name);
  const moreThan600px = useMediaQuery('(min-width:600px)');
  
  if (loading) return <LoadingYachty />;

  const events = data?.yc_events;
  if (events.length === 0) {
    return (
      <>
        <NavBar/>
        <Stack spacing={4} sx={{margin: 10}} alignItems="center">
          <Typography noWrap sx={{padding: 1}} variant="h5">{`${yachtClubName} Events`}</Typography>
          <Typography>There are no upcoming events at this time</Typography>
        </Stack>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <Grid container justifyContent="center">
        <Typography noWrap sx={{padding: 1}} variant="h5">{`${yachtClubName} Events`}</Typography>
      </Grid>
      <Stack 
        spacing={2} 
        alignItems="center"
      >
        {events.map((event, index) => <YcEventPoster eventData={event} key={`${event.event_name}${index}`} />)}
      </Stack>
    </>
  )
};

export default YachtClubFeed;
