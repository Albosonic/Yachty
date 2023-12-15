import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, useMediaQuery } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import { gql, useQuery } from "@apollo/client";
import LoadingYachty from "./LoadingYachty";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const { id, convoPartnerId, newMessage } = dmRoom;
  const memberId = useSelector(state => state.auth.member.id);
  const [notify, setNotify] = useState(false);
  
  const {error, loading, data: data} = useQuery(GET_YC_DM_MEMBER, {
    variables: {
      memberId: convoPartnerId
    }
  })

  useEffect(() => {
    setNotify(memberId !== newMessage && newMessage !== null);
  }, [newMessage])
  
  const moreThan600px = useMediaQuery('(min-width:600px)');

  if (loading) return <LoadingYachty isRoot={false} />

  const {profilePic, firstName} = data.yc_members[0];
  
  return (
    <>
      {moreThan600px &&
        <>
          <ListItem
            onClick={() => router.replace({pathname: '/yachty/direct_messages', query: {rid: id}})}
          >
            <ListItemAvatar>
              <Grid container>
                <Avatar src={profilePic} />
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
            <ListItemText primary={firstName} />
          </ListItem>
        </>
      }
    </>
  )
}

export default DmRoom;