import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { INSERT_MESSAGE, POLL_ALL_MESSAGES } from "@/lib/gqlQueries/dmgql";
import ImageIcon from '@mui/icons-material/Image';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Avatar, Button, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingYachty from "@/components/LoadingYachty";
import DmRoom from "@/components/DmRoom";

const directMessageFeed = ({props}) => {
  const router = useRouter();
  const currentRmId = router.query.rid;
  const {user, isLoading} = useUser()
  const memberId = useSelector(state => state.auth.member.id);
  const [inputMsg, setMessage] = useState('');
  const dmRooms = useSelector(state => state.msgs.dmRooms);
  const [showReactionOptions, setShowReactionOptions] = useState({ msgRef: null, showOptions: false });
  const moreThan600px = useMediaQuery('(min-width:600px)');

  const {data: pollMsgData, loading: pollLoading, error: pollError} = useQuery(POLL_ALL_MESSAGES, {
    fetchPolicy: 'no-cache',
    variables: {roomId: currentRmId},
    pollInterval: 5500,
  });

  const [insertMessage, {loading: msgLoading}] = useMutation(INSERT_MESSAGE);

  const getMessageGridHeight = () => {
    if (moreThan600px) return '75%';
    if (!moreThan600px) return '93%';
  }

  if (pollLoading) return <LoadingYachty />;
  if (dmRooms.length === 0) {
    return (
      <>
        <NavBar/>
        <Stack sx={{margin: 10}} alignItems="center">
          <Typography>You have no messages at this time.</Typography>
        </Stack>
      </>
    )
  }

  const userPic = user?.picture;
  const getMsgFacade = (messages) => {
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

  const messageGridHeight = getMessageGridHeight();

  const Msg = ({ msg, authorId, profilePic }) => {
    const leftOrRight = authorId === memberId ? "flex-start" : "flex-end";
    return (
      <Grid container justifyContent={leftOrRight} sx={{ width: '80%'}} >
        {authorId === memberId ? (
          <>
          <Avatar src={profilePic || userPic}
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
            <Avatar src={profilePic || userPic}
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

  return (
    <>
      <NavBar />
        <Grid  container justifyContent="flex-start" direction="row" wrap="nowrap" columns={2}>
          <Stack sx={{margin: 0, maxWidth: 500, height: '100vh', border: '1px solid grey'}}>
            <List sx={{
              overflow: "hidden",
              overflowY: "scroll",
              height: "100%",
            }}>
              {moreThan600px && dmRooms.map((room,  i) => <DmRoom dmRoom={room} key={room.id} />)}
            </List>
          </Stack>
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
        </Grid>
    </>
  )
};

export default directMessageFeed;

