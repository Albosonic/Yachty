import EventTicketForPurchase from "@/components/EventTicketForPurchase"
import LoadingYachty from "@/components/LoadingYachty";
import NavBar from "@/components/NavBar";
import { EVENT_TICKET_FOR_PURCHASE } from "@/lib/gqlQueries/ycFeedgql";
import { useQuery } from "@apollo/client";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CircularProgress, Fab, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const YcEventTicketForPurchase = () => {
  const router = useRouter();
  const eventId = router.query.eventId;
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id)
  const {loading, data, error } = useQuery(EVENT_TICKET_FOR_PURCHASE, {variables:{eventId}, fetchPolicy: "no-cache" });
  if (loading || data === undefined) return <LoadingYachty />
  const eventData = data.yc_events[0];
  return (
    <>
      <NavBar />
      <Stack alignItems="center">  
        <Fab size="small" sx={{alignSelf: 'flex-start', margin: 5}} color="primary" variant="extended" onClick={() => router.replace({pathname: '/yachty/yc_feed', query: { ycId }})}>
          <ArrowBackIcon />
          Back
        </Fab>      
        <EventTicketForPurchase eventData={eventData} />
      </Stack>
    </>
  )
}

export default YcEventTicketForPurchase;