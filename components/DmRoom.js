import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import TelegramIcon from '@mui/icons-material/Telegram';
import CircleIcon from '@mui/icons-material/Circle';

import { gql, useQuery } from "@apollo/client";
import LoadingYachty from "./LoadingYachty";
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const GET_YC_DM_MEMBER = gql`
query getYcDmMember($memberId: uuid!) {
  yc_members(where: {id: {_eq: $memberId}}) {
    profilePic
    firstName
  }
}`

const DmRoom = ({dmRoom}) => {
  const { convoPartnerId, newMessage } = dmRoom;
  const memberId = useSelector(state => state.auth.member.id);
  const [notify, setNotify] = useState(false);

  const {error, loading, data} = useQuery(GET_YC_DM_MEMBER, {
    variables: {
      memberId: convoPartnerId
    }
  })

  useEffect(() => {
    setNotify(memberId !== newMessage && newMessage !== null);
  }, [newMessage])

  if (loading) return <LoadingYachty isRoot={false} />

  const {profilePic, firstName} = data.yc_members[0];
  console.log('data.yc_members[0]', data.yc_members[0])

  return (
    <Grid container justifyContent="space-around">    
      <ListItemAvatar>        
          <Grid container justifyContent="space-around" flexWrap="nowrap">            
            <Avatar sx={{width: 60, height: 60}} src={profilePic} />
            {notify &&
            <CircleIcon
              color="error"
              sx={{
                fontSize: 14,
                marginBottom: 2,
                marginLeft: -.5,
              }}
            />}
          </Grid>        
        </ListItemAvatar>
        <ListItemText sx={{marginLeft: 3}} primary={firstName} />
      <TelegramIcon />
    </Grid>
  )
}

export default DmRoom;