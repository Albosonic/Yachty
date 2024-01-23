import LoadingYachty from "@/components/LoadingYachty";
import NavBar from "@/components/NavBar";
import YcEventPoster from "@/components/YcEventPoster";
import { useEventData } from "@/lib/gqlQueries/createYCEventgql";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";



const EventView = () => {
  const {error, loading, data} = useEventData();
  if (loading) return <LoadingYachty />;
  const eventData = data.yc_events[0]
  return (
    <>
      <NavBar />
      <Stack alignItems="center" sx={{margin: 5}}>
        <YcEventPoster eventData={eventData} />  
      </Stack>
    </>
  )
}

export default EventView;