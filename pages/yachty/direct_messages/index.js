import { useSelector } from "react-redux";
import { Grid, List, ListItem, Stack, Typography, useMediaQuery } from "@mui/material";
import NavBar from "@/components/NavBar";
import DmRoom from "@/components/DmRoom";
import DmMsgFeed from "@/components/DmMsgFeed";
import { useRouter } from "next/router";

const directMessageFeed = () => {  
  const router = useRouter();
  const dmRooms = useSelector(state => state.msgs.dmRooms);
  const moreThan600px = useMediaQuery('(min-width:600px)');

  const handleClick = (id) => {
    const pathSegment = moreThan600px ? 'direct_messages' : 'mobile_dm_rooms';    
    router.replace({pathname: `/yachty/${pathSegment}`, query: {rid: id}})
  }

  if (dmRooms.length === 0) {
    return (
      <>
        <NavBar/>
        <Stack sx={{margin: 10}} alignItems="center">
          <Typography>You have no messages at this time.</Typography>
        </Stack>
      </>
    )
  }

  return (
    <>
      <NavBar />
        <Grid  container justifyContent="flex-start" direction="row" wrap="nowrap" columns={2}>
          <Stack sx={{margin: 0, maxWidth: 500, minWidth: 200, height: '100vh', border: '1px solid grey'}}>
            <List sx={{
              overflow: "hidden",
              overflowY: "scroll",
              height: "100%",
              width: "100%",
              minWidth: 200,
            }}>
              {dmRooms.map((room,  i) => {
                return (
                  <ListItem key={room.id} onClick={() => handleClick(room.id)}>
                    <DmRoom dmRoom={room} key={room.id} />
                  </ListItem>
                )
              })}
            </List>
          </Stack>
          <DmMsgFeed />
        </Grid>
    </>
  )
};

export default directMessageFeed;

