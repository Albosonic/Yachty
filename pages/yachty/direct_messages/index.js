// "use client"

import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { Avatar, Box, Button, CircularProgress, Grid, Stack, TextField, Typography } from "@mui/material";
import { DIRECT_MESSAGE_SUBSCRIPTION, GET_ALL_USER_ROOMS, INSERT_MESSAGE, POLL_ALL_MESSAGES } from "./dmgql";
import NavBar from "@/components/NavBar";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import { Margin } from "@mui/icons-material";

const directMessageFeed = ({props}) => {
  const router = useRouter();
  const currentRmId =  router.query.rid;
  const memberId = useSelector(state => state.auth.member.id);
  const [inputMsg, setMessage] = useState('');
  const [showReactionOptions, setShowReactionOptions] = useState({ msgRef: null, showOptions: false });
  const { data: userRmData, loading: userRmLoading, error: userRmError } = useQuery(GET_ALL_USER_ROOMS, {variables: {memberId}});
  // const { data: userRmData, loading: userRmLoading, error: userRmError } = useQuery(GET_ALL_USER_ROOMS, {variables: {memberId}});
   
  const {data: pollMsgData, loading: pollLoading, error: pollError} = useQuery(POLL_ALL_MESSAGES, {
    variables: {roomId: currentRmId},
    pollInterval: 1500,
  });

  const [insertMessage, {loading: msgLoading}] = useMutation(INSERT_MESSAGE);
  // const {data: messageData, loading: messageLoading} = useSubscription(DIRECT_MESSAGE_SUBSCRIPTION, {
  //   variables: {roomId: currentRmId}
  // });
  
  if (userRmLoading) return <CircularProgress />;
  if (pollLoading) return <CircularProgress />;
  
  const getMsgFacade = (messages) => {
    if (!messages) return [{}];
    return messages.map(msg => {
      console.log('no:', msg)
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
    const msgResp = await insertMessage({
    variables: {
      object: {
        roomId: currentRmId,
        authorId: memberId,
        message: inputMsg,
        created_at: new Date().toISOString()
      }
    }});
  }
  const msgFacade = getMsgFacade(pollMsgData?.messages);
  return (
    <>
      <NavBar />
      <Grid container >
        <Stack>          
          <Stack spacing={10} >
            <Box
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                height: 700,
                overflow: "hidden",
                overflowY: "scroll",              
              }}
            >
            {msgFacade.map(((msg, i) => {
              const {message, profilePic} = msg;
              return (
                <>
                  <Grid 
                    container 
                    key={msg+i}
                    margin={3}                
                  >
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
                      {message}
                    </Typography>
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

