import { useMutation, useQuery } from "@apollo/client";
import ImageIcon from '@mui/icons-material/Image';
import { Avatar, Box, Button, CircularProgress, Grid, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Typography } from "@mui/material";
import { GET_ALL_USER_ROOMS, INSERT_MESSAGE, POLL_ALL_MESSAGES } from "./dmgql";
import NavBar from "@/components/NavBar";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";

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
    if (authorId === memberId) {
      return (
        <>
          <Avatar src={profilePic}
            sx={{
              width: 20,
              height: 20,
              marginRight: -1,
            }} />
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
      )
    } else {
      return (
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
      )
    }
  }

  const msgFacade = getMsgFacade(pollMsgData?.messages);
  const rooms = userRmData?.user_rooms;

  return (
    <>
      <NavBar />
      <Grid container sx={{border: '2px solid green'}} >
        <Stack>
          <List>
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
        <Stack sx={{border: "1px solid red", width: "70%"}}>
          <Stack spacing={10} >
            <Box
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                height: 200,            
                overflow: "hidden",
                overflowY: "scroll"
              }}
            >
            {msgFacade.map(((msg, i) => {
              const {message, authorId, profilePic} = msg;
              return (
                <>
                  <Grid
                    container
                    key={msg+i}
                    margin={1}
                  >
                    <Msg msg={message} authorId={authorId} profilePic={profilePic} />
                  </Grid>
                </>
              )
            }))}
          </Box>
          </Stack>
          <TextField
            multiline
            label="message"
            rows={5}
            value={inputMsg}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Grid>
    </>
  )
};

export default directMessageFeed;

