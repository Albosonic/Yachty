import LoadingYachty from "@/components/LoadingYachty";
import NavBar from "@/components/NavBar";
import RacePoster from "@/components/RacePoster";
import { useRaceData } from "@/lib/gqlQueries/racinggql";
import { Stack,  } from "@mui/material";

const EventView = () => {
  const {error, loading, data} = useRaceData();
  if (loading) return <LoadingYachty />;  
  const raceData = data.races[0]  
  return (
    <>
      <NavBar />
      <Stack alignItems="center" sx={{margin: 5}}>
        <RacePoster race={raceData} />  
      </Stack>
    </>
  )
}

export default EventView;