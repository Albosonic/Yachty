import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { INSERT_MESSAGE, POLL_ALL_MESSAGES } from "@/lib/gqlQueries/dmgql";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, Container, Grid, Stack, TextField } from "@mui/material";
import LoadingYachty from "@/components/LoadingYachty";
import { pollUserRooms } from "@/slices/actions/msgActions";
import Msg from "@/components/Message";

const getMsgFacade = (messages) => {
  if (!messages) return [];
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

const DmMsgFeed = () => {
  const router = useRouter();
  const currentRmId = router.query.rid;
  const dispatch = useDispatch();    
  const [inputMsg, setMessage] = useState('');
  const memberId = useSelector(state => state.auth.member.id);
  const moreThan600px = useMediaQuery('(min-width:600px)');
  // const [showReactionOptions, setShowReactionOptions] = useState({ msgRef: null, showOptions: false });
  const {data: pollMsgData, loading: pollLoading, error: pollError} = useQuery(POLL_ALL_MESSAGES, {
    fetchPolicy: 'no-cache',
    variables: {roomId: currentRmId},
    pollInterval: 5500,
  });
  const [insertMessage, {loading: msgLoading}] = useMutation(INSERT_MESSAGE);

  if (pollLoading) return <LoadingYachty isRoot={false} />;

  const getMessageGridHeight = () => {
    if (moreThan600px) return '75%';
    if (!moreThan600px) return '93%';
  }

  const messageGridHeight = getMessageGridHeight();

  const sendMessage = async () => {
    await insertMessage({
    variables: {
      roomId: currentRmId,
      authorId: memberId,
      message: inputMsg,
      createdAt: new Date().toISOString()
    }});
    dispatch(pollUserRooms());
    setMessage('');    
  }

  const msgFacade = getMsgFacade(pollMsgData?.messages);

  return (
    <Container sx={{margin: 0}} fixed maxWidth="sm">
      <Stack sx={{width: messageGridHeight, margin: 0, bottom: 0, position: 'fixed'}}>
        <Grid
          sx={{
            overflow: "hidden",
            overflowY: "scroll",
            width: "100%",
            maxHeight: 600,
            marginTop: 20,
            marginBottom: 5,
          }}
        >
          {msgFacade.map(((msg, i) => {
            const {message, authorId, profilePic} = msg;
            return (
              <Grid
                key={msg.authorId + i + message}
                container
                margin={1}
                justifyContent="center"
              >
                <Msg msg={message} authorId={authorId} profilePic={profilePic} />
              </Grid>
            )
          }))}
        </Grid>
        <TextField
          multiline
          label="message"
          value={inputMsg}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{endAdornment: <Button onClick={sendMessage}>Send</Button>}}
          fullWidth
        />
      </Stack>
    </Container>
  )
}

export default DmMsgFeed;