import { useRouter } from "next/router";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_YC_EVENTS_FEED } from "@/lib/gqlQueries/ycFeedgql";
import NavBar from "@/components/NavBar";
import YcEventPoster from "@/components/YcEventPoster";

const YachtClubFeed = () => {
  const router = useRouter();
  const ycId = router.query.ycId;
  const date = new Date();
  const dateIso = date.toISOString().slice(0, 10);
  const variables = {ycId, after: dateIso };
  const {error, loading, data} = useQuery(GET_YC_EVENTS_FEED, { variables, fetchPolicy: "no-cache" });
  
  if (loading) return <CircularProgress />
  const events = data?.yc_events;
  
  return (
    <>
      <NavBar />
      <Stack justifyContent="center" sx={{margin: '0 auto'}}>
        <Box
           sx={{
            mb: 2,
            display: "flex",
            flexDirection: "column",
            height: 700,
            overflow: "hidden",
            overflowY: "scroll",
          }}
        >
          {events.map((event, index) => <YcEventPoster eventData={event} key={`${event.event_name}${index}`} />)}
        </Box>
      </Stack>
    </>
  )
};

export default YachtClubFeed;