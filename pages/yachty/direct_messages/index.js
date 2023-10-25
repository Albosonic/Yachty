import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_USER_ROOMS, INSERT_MESSAGE, POLL_ALL_MESSAGES } from "@/lib/gqlQueries/dmgql";
import ImageIcon from '@mui/icons-material/Image';
import { Avatar, Box, Button, CircularProgress, Grid, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";


const directMessageFeed = ({props}) => {
  const router = useRouter();
  const currentRmId =  router.query.rid;
  const memberId = useSelector(state => state.auth.member.id);
  const [inputMsg, setMessage] = useState('');
  const [showReactionOptions, setShowReactionOptions] = useState({ msgRef: null, showOptions: false });
  // TOD0: poll user rooms as well, so that we can show new direct message initiations.
  const { data: userRmData, loading: userRmLoading, error: userRmError } = useQuery(GET_ALL_USER_ROOMS, {
    variables: { memberId },
    fetchPolicy: 'no-cache'
  });

  const {data: pollMsgData, loading: pollLoading, error: pollError} = useQuery(POLL_ALL_MESSAGES, {
    variables: {roomId: currentRmId},
    pollInterval: 1500,
  });

  const [insertMessage, {loading: msgLoading}] = useMutation(INSERT_MESSAGE);

  if (pollLoading || userRmLoading) return <CircularProgress />;

  const getMsgFacade = (messages) => {
    console.log('messages :', messages)
    if (!messages) return [{}];
    return messages.map(msg => {
      const {
        id: msgId,
        authorId,
        created_at: createdAt,
        recipientId,
        message,
        yc_member: {
          firstName,
          profilePic
        }
      } = msg;

      return {
        msgId,
        authorId,
        createdAt,
        recipientId,
        firstName,
        profilePic,
        message,
        onClick: (msgId) => setShowReactionOptions({ msgRef: msgId, showOptions: false })
      }
    });
  }

  const sendMessage = async () => {
    await insertMessage({
    variables: {
      object: {
        roomId: currentRmId,
        authorId: memberId,
        message: inputMsg,
        created_at: new Date().toISOString()
      }
    }});
    setMessage('');
  }
  console.log('userRmData =====', userRmData?.user_rooms)

  const Msg = ({ msg, authorId, profilePic }) => {
    return (
      <Grid container sx={{overflow: 'hidden'}} >
        {authorId === memberId ? (
          <>
          <Avatar src={profilePic}
            sx={{
              width: 20,
              height: 20,
              marginRight: -1,
            }}
          />
          <Typography
            sx={{
              border: '1px solid grey',
              borderRadius: 4,
              padding: .7,
              opacity: .5
            }}
          >
            {msg}
          </Typography>
        </>
        ) : (
          <>
            <Typography
              sx={{
                border: '1px solid grey',
                borderRadius: 4,
                padding: .7,
                opacity: .5
              }}
            >
              {msg}
            </Typography>
            <Avatar src={profilePic}
              sx={{
                width: 20,
                height: 20,
                marginRight: -1,
              }}
            />
          </>
        )}
      </Grid>
    )
  }

  const msgFacade = getMsgFacade(pollMsgData?.messages);
  const rooms = userRmData?.user_rooms;

  return (
    <>
      <NavBar />
        <Grid container>
          <Stack sx={{maxWidth: 500, border: '1px solid grey'}}>
            <List sx={{
              overflow: "hidden",
              overflowY: "scroll",              
              height: "100%"
            }}>
              {rooms.map(room => {
                const {yc_member: { profilePic }} = room;
                return (
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar src={profilePic}>
                        <ImageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Photos" secondary="Jan 9, 2014" />
                  </ListItem>
                )
              })}
            </List>
          </Stack>
          <Stack 
              sx={{
              overflow: "hidden",
              overflowY: "scroll",
              width: "60%",
              maxHeight: 650
            }}>
            <Grid>
              {msgFacade.map(((msg, i) => {
                const {message, authorId, profilePic} = msg;
                return (
                  <>
                    <Grid
                      container
                      key={msg.authorId}
                      margin={1}
                    >
                      <Msg msg={message} authorId={authorId} profilePic={profilePic} />
                    </Grid>
                  </>
                )
              }))}
            </Grid>
        </Stack>
        </Grid>
        <Grid container>
          <TextField
            multiline
            label="message"
            value={inputMsg}
            onChange={(e) => setMessage(e.target.value)}
            InputProps={{endAdornment: <Button onClick={sendMessage}>Send</Button>}}
            fullWidth
          />
      </Grid>
    </>
  )
};

export default directMessageFeed;

