import { useRouter } from "next/router";
import { Fragment } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { GET_ALL_USER_ROOMS_BY_ID } from "@/lib/gqlQueries/dmgql";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import NavBar from "@/components/NavBar";

const MobileDMRooms = () => {
  const router = useRouter();
  const memberId = useSelector(state => state.auth.member.id);
  const { data: userRmData, loading: userRmLoading, error: userRmError } = useQuery(GET_ALL_USER_ROOMS_BY_ID, {
    variables: { memberId },
    fetchPolicy: 'no-cache'
  });
  if (userRmLoading) return <CircularProgress />
  const rooms = userRmData.user_rooms;
  return (
    <>
      <NavBar />
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>      
        {rooms.map(room => {          
          const {roomId, recipientId, yc_member: { firstName, profilePic }} = room;
          if (recipientId === memberId) return null;
          return (
            <>
              <ListItem onClick={() => router.replace({pathname: '/yachty/direct_messages', query: { rid: roomId }})} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src={profilePic || "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/4336f1b1-2f5a-40ae-8c47-6531a6c3d5f8" }/>
                </ListItemAvatar>
                <ListItemText
                  primary={room.yc_member.name}
                  secondary={
                    <Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {firstName}
                      </Typography>
                      {" — ..."}
                    </Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </>)
          })}
      </List>
    </>
  )  
}

export default MobileDMRooms;