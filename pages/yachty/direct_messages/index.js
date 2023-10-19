// "use client"

import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { Button, CircularProgress, Grid, Stack, TextField, Typography } from "@mui/material";
import { DIRECT_MESSAGE_SUBSCRIPTION, GET_ALL_USER_ROOMS, INSERT_MESSAGE } from "./dmgql";
import NavBar from "@/components/NavBar";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";

const directMessageFeed = ({props}) => {
  const router = useRouter();
  const currentRmId =  router.query.rid;
  const memberId = useSelector(state => state.auth.member.id);
  const [message, setMessage] = useState('');
  const {error, loading, data} = useQuery(GET_ALL_USER_ROOMS, {variables: {memberId}});
  const [insertMessage, {loading: msgLoading}] = useMutation(INSERT_MESSAGE);
  const {data: messageData, loading: messageLoading} = useSubscription(DIRECT_MESSAGE_SUBSCRIPTION, {
    variables: {roomId: currentRmId}
  });
  
  if (loading) return <CircularProgress />;
  
  console.log('messageData ==', messageData)
  console.log('messageData ==', messageLoading)
  const sendMessage = async () => {
    const msgResp = await insertMessage({
    variables: {
      object: {
        roomId: currentRmId,
        authorId: memberId,
        message: message,
        created_at: new Date().toISOString()
      }
    }});
    console.log('msgResp', msgResp)
  }
  return (
    <>
      <NavBar />
      <Grid container >
        <Stack>
          <TextField
            multiline
            label="message"
            rows={5}
            value={message}
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

