import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Box, Button, Card, CircularProgress, Divider, Grid, Stack, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import { GET_RACES_BY_YCID_AFTER_DATE, GET_RACES_BY_YCID_BEFORE_DATE } from "@/lib/gqlQueries/racinggql";
import { useSelector } from "react-redux";
import { getIsoDate } from "@/lib/utils/getters";
import RacePoster from "@/components/RacePoster";

const Racing = () => {
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  // const {error, loading, data: raceMemberData} = useQuery(GET_RACE_MEMBER, {variables: {memberId}});
  const {error: raceEventError, loading: raceEventsLoading, data: raceEventData} = useQuery(GET_RACES_BY_YCID_AFTER_DATE, {
    fetchPolicy: 'no-cache',
    variables: {
      ycId: ycId,
      startDate: getIsoDate(),
    }
  });
  const {error: pastRaceEventError, loading: pastRraceEventsLoading, data: pastRaceEventData} = useQuery(GET_RACES_BY_YCID_BEFORE_DATE, {
    fetchPolicy: 'no-cache',
    variables: {
      ycId: ycId,
      startDate: getIsoDate(),
    }
  });

  if (pastRraceEventsLoading || raceEventsLoading) return <CircularProgress />;
  
  const pastRaces = pastRaceEventData.races;
  const races = raceEventData.races;
  const left = showLeftPanel ? 1.7 : 0;
  const right = showLeftPanel ? 0 : 1.7;
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
        <Button sx={{borderBottom: left, borderRight: left, borderRadius: 0}} fullWidth onClick={() => setShowLeftPanel(true)}>Races Gone By</Button>
        <Divider orientation="vertical" flexItem></Divider>
        <Button sx={{borderBottom: right, borderLeft: right, borderRadius: 0}} fullWidth onClick={() => setShowLeftPanel(false)}>Races</Button>
      </Grid>
      {showLeftPanel ? (
        <Stack sx={{margin: 5}} spacing={2} alignItems="center">
          <Stack spacing={4}>
            {pastRaces.map((race, index) => <RacePoster race={race} key={`${race.raceName}${index}`} />)}
          </Stack>
        </Stack>
      ) : (
        <Stack spacing={2} alignItems="center">
          <Typography noWrap sx={{padding: 1}} variant="h4">Upcoming Races</Typography>
            <Stack spacing={4}>
              {races.map((race, index) => <RacePoster race={race} key={`${race.raceName}${index}`} />)}
            </Stack>
        </Stack>
      )}
    </>
  )
}

export default Racing;