import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Divider, Grid, Stack, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import { GET_RACES_BY_YCID_AFTER_DATE } from "@/lib/gqlQueries/racinggql";
import { useSelector } from "react-redux";
import { getIsoDate } from "@/lib/utils/getters";

const Racing = () => {
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  console.log('id ======', ycId);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const {error: raceEventError, loading: raceEventsLoading, data: raceEventData} = useQuery(GET_RACES_BY_YCID_AFTER_DATE, {
    variables: {
      ycId: ycId,
      startDate: getIsoDate(),
    }
  });

  if (raceEventsLoading) return <CircularProgress />;
    console.log('raceData: ', raceEventData);
  return (
    <>
      <NavBar />
      <Grid 
        sx={{ borderBottom: '1px solid lightGrey', height: '70px'}} 
        container 
        flexWrap="nowrap" 
        justifyContent="space-around" 
        width="100%"
      >
        <Button fullWidth onClick={() => setShowLeftPanel(true)}>
          My Race Profile
        </Button>
        <Divider orientation="vertical" flexItem></Divider>
        <Button fullWidth onClick={() => setShowLeftPanel(false)}>
          Races
        </Button>
      </Grid>
      {showLeftPanel ? (
        <Stack spacing={2} alignItems="center">
          <Typography>My Race Profile</Typography>
        </Stack>
      ) : (
        <Stack spacing={2} alignItems="center">
          <Typography>Race Feed</Typography>
          <Grid container justifyContent="center">
            {/* <Typography noWrap sx={{padding: 1}} variant="h4">{ yachtClubName }</Typography> */}
              <Typography noWrap sx={{padding: 1}} variant="h4">Upcoming Events</Typography>
            </Grid>
            <Stack justifyContent="center" sx={{margin: '0 auto'}}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  // maxWidth: 600,
                  height: 700,
                  overflow: "hidden",
                  overflowY: "scroll",
                }}
              >
                {/* {raceEventData.map((race, index) => {

                  return <YcEventPoster eventData={event} key={`${event.event_name}${index}`} />
                })} */}
              </Box>
            </Stack>
        </Stack>
      )}
    </>
  )
}

export default Racing;