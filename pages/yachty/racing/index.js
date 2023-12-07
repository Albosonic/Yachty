import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Divider, Grid, Stack, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import { GET_RACERS_BY_YCID, GET_RACES_BY_YCID_AFTER_DATE, GET_RACES_BY_YCID_BEFORE_DATE } from "@/lib/gqlQueries/racinggql";
import { useSelector } from "react-redux";
import { getIsoDate } from "@/lib/utils/getters";
import RacePoster from "@/components/RacePoster";
import LoadingYachty from "@/components/LoadingYachty";
import RacerProfileCard from "@/components/RacerProfileCard";

const VIEWS = {
  RACES_GONE_BY: 'RACES_GONE_BY',
  RACERS: 'RACERS',
  RACES: 'RACES',
}
const {RACES_GONE_BY, RACES, RACERS} = VIEWS;

const Racing = () => {
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [view, setView] = useState(RACES);  
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

  const {error: racersError, loading: racersLoading, data: racersData} = useQuery(GET_RACERS_BY_YCID, {
    fetchPolicy: 'no-cache',
    variables: {
      ycId: ycId,      
    }
  });
  if (pastRraceEventsLoading || raceEventsLoading || racersLoading) return <LoadingYachty />;  
  console.log('racerData ========', racersData)
  
  const pastRaces = pastRaceEventData.races;
  const races = raceEventData.races;
  const racers = racersData.yc_members;
  const left = view === RACES_GONE_BY ? 1.7: 0;
  const center = view === RACES ?  1.7 : 0;
  const right = view === RACERS ? 1.7: 0;

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
        <Button sx={{borderBottom: left, borderRight: left, borderRight: left, borderRadius: 0}} fullWidth onClick={() => setView(RACES_GONE_BY)}>Races Gone By</Button>
        <Divider orientation="vertical" flexItem></Divider>
        <Button sx={{borderBottom: center, borderLeft: center, borderRight: center, borderRadius: 0}} fullWidth onClick={() => setView(RACES)}>Races</Button>
        <Divider orientation="vertical" flexItem></Divider>
        <Button sx={{borderBottom: right, borderLeft: right, borderRight: right, borderRadius: 0}} fullWidth onClick={() => setView(RACERS)}>Racers</Button>
      </Grid>

      {view === RACES_GONE_BY &&
        <Stack spacing={2} alignItems="center">
          <Typography noWrap sx={{padding: 1}} variant="h5">Past Races</Typography>
          <Stack spacing={4}>            
            {pastRaces.length === 0 && <Typography>The are no past races at this time.</Typography>}
            {pastRaces.map((race, index) => <RacePoster race={race} key={`${race.raceName}${index}`} />)}
          </Stack>
        </Stack>
      }
      {view === RACES &&
        <Stack spacing={2} alignItems="center">
          <Typography noWrap sx={{padding: 1}} variant="h5">Upcoming Races</Typography>
          <Stack spacing={4}>
            {races.length === 0 && <Typography>The are no upcoming races at this time.</Typography>}
            {races.map((race, index) => <RacePoster race={race} key={`${race.raceName}${index}`} />)}
          </Stack>
        </Stack>
      }      
      {view === RACERS &&
        <Stack spacing={2} alignItems="center">
        <Typography noWrap sx={{padding: 1}} variant="h5">Racers</Typography>
        <Stack spacing={4}>
          {racers.map((racer, index) => <RacerProfileCard racer={racer} key={`${racer.id}${index}`} />)}
          {racers.length === 0 && <Typography>The are no upcoming races at this time.</Typography>}          
        </Stack>
      </Stack>
      }
    </>
  )
}

export default Racing;