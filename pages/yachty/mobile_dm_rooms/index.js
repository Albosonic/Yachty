import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Stack, ListItem, ListItemAvatar, Avatar, ListItemText, Fab, useMediaQuery } from "@mui/material";
import NavBar from "@/components/NavBar";
import DmRoom from "@/components/DmRoom";
import DmMsgFeed from "@/components/DmMsgFeed";

const mobileDmRooms = () => {
  const router = useRouter();
  const rid = router.query.rid;
  const dmRooms = useSelector(state => state.msgs.dmRooms);
  const profilePic = useSelector(state => state.auth.member.profilePic);
  const firstName = useSelector(state => state.auth.member.firstName);  
  const moreThan600px = useMediaQuery('(min-width:600px)');

  const handleClick = (id) => {
    const pathSegment = moreThan600px ? 'direct_messages' : 'mobile_dm_rooms';    
    router.replace({pathname: `/yachty/${pathSegment}`, query: {rid: id}})
  }

  return (
    <>
      <NavBar />
      <Stack>
        {rid && 
          <Fab size="small" onClick={() => router.replace({pathname: '/yachty/mobile_dm_rooms'})} variant="extended" sx={{ alignSelf: 'flex-start', margin: 3 }} color="primary">
            <ArrowBackIcon /> Back
          </Fab>
        }
        {rid && <DmMsgFeed />}
        {!rid && 
          <>
            <ListItem>
              <ListItemAvatar sx={{padding: 5}}>
                <Avatar sx={{width: 70, height: 70}} src={profilePic} />
              </ListItemAvatar>
              <ListItemText primary={firstName} />
            </ListItem>
            {dmRooms.map((room,  i) => {              
              return (
                <ListItem onClick={() => handleClick(room.id)} key={room.id} sx={{padding: 2}}>
                  <DmRoom dmRoom={room} />
                </ListItem>
              )
            })} 
          </>
        }        
      </Stack>
    </>
  )
}

export default mobileDmRooms;
