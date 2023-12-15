import { useSelector } from "react-redux"
import ImageIcon from '@mui/icons-material/Image';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Stack, useMediaQuery } from "@mui/material";
import { gql, useQuery } from "@apollo/client";
import LoadingYachty from "./LoadingYachty";

const GET_YC_DM_MEMBER = gql`
query getYcDmMember($memberId: uuid!) {
  yc_members(where: {id: {_eq: $memberId}}) {
    profilePic
    firstName
  }
}
`

const DmRoom = ({dmRoom}) => {
  const { id, convoPartnerId } = dmRoom;
  const moreThan600px = useMediaQuery('(min-width:600px)');

  const {error, loading, data: data} = useQuery(GET_YC_DM_MEMBER, {
    variables: {
      memberId: convoPartnerId
    }
  })

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
              <Avatar src={profilePic}>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={firstName} />
          </ListItem>
        </>
      }
    </>
  )
}

export default DmRoom;