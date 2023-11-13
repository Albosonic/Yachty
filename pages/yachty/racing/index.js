import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Divider, Grid, Stack, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import { GET_RACES_BY_YCID_AFTER_DATE } from "@/lib/gqlQueries/racinggql";
import { useSelector } from "react-redux";
import { getIsoDate } from "@/lib/utils/getters";
import RaceEventPoster from "@/components/RaceEventPoster";
import { GET_RACE_MEMBER } from "@/lib/gqlQueries/membersgql";

const Racing = () => {
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const memberId = useSelector(state => state.auth.member.id);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const {error, loading, data: raceMemberData} = useQuery(GET_RACE_MEMBER, {variables: {memberId}}); 
  const {error: raceEventError, loading: raceEventsLoading, data: raceEventData} = useQuery(GET_RACES_BY_YCID_AFTER_DATE, {
    variables: {
      ycId: ycId,
      startDate: getIsoDate(),
    }
  });

  if (raceEventsLoading) return <CircularProgress />;
    console.log('raceMemberData: ', raceMemberData);
    const { yc_members: [member] } = raceMemberData;
    const {firstName, vessels: [vessel]} = member;

    const races = raceEventData.races;

    const { vesselName, beam, draft, hullMaterial, img, insuranceInfo, type, length } = vessel;    

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
        <Button fullWidth onClick={() => setShowLeftPanel(true)}>My Race Profile</Button>        
        <Divider orientation="vertical" flexItem></Divider>
        <Button fullWidth onClick={() => setShowLeftPanel(false)}>Races</Button>
      </Grid>
      {showLeftPanel ? (

        // TODO: EDIT EACH THING INDIVIDUALY
        // TODO: EDIT EACH THING INDIVIDUALY
        // TODO: EDIT EACH THING INDIVIDUALY
        // TODO: EDIT EACH THING INDIVIDUALY

        <Stack spacing={2} alignItems="center">
          {img && 
          <Box
            component="img"
            sx={{
              height: 90,
              width: 120,
              marginBottom: 10,
            }}
            alt="yacht club logo"
            src={img}
          />}
          <Typography variant="h5">{vesselName}</Typography>
          <Typography variant="h4">{firstName}</Typography>
        </Stack>




      ) : (
        <Stack spacing={2} alignItems="center">
          <Typography noWrap sx={{padding: 1}} variant="h4">Upcoming Races</Typography>
          <Grid container justifyContent="center">            
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
                {races.map((race, index) => <RaceEventPoster raceData={race} key={`${race.raceName}${index}`} />)}
              </Box>
            </Stack>
        </Stack>
      )}
    </>
  )
}

export default Racing;