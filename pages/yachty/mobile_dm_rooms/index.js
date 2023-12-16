import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { INSERT_MESSAGE, POLL_ALL_MESSAGES } from "@/lib/gqlQueries/dmgql";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, Container, Grid, Stack, Tabs, Tab, TextField, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import LoadingYachty from "@/components/LoadingYachty";
import DmRoom from "@/components/DmRoom";
import { pollUserRooms } from "@/slices/actions/msgActions";
import Msg from "@/components/Message";

const mobileDmRooms = ({props}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentRmId = router.query.rid;
  const memberId = useSelector(state => state.auth.member.id);
  const dmRooms = useSelector(state => state.msgs.dmRooms);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [showReactionOptions, setShowReactionOptions] = useState({ msgRef: null, showOptions: false });
  const [inputMsg, setMessage] = useState('');

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

  const messageGridHeight = getMessageGridHeight();
  const msgFacade = getMsgFacade(pollMsgData?.messages);
  
  return (
    <>
      <NavBar />      
      <Grid container justifyContent="center" sx={{padding: 2}}>
        <Tabs            
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable dm rooms"
        >
          {dmRooms.map((room,  i) => <Tab key={room.id} icon={<DmRoom dmRoom={room} />} /> )}
        </Tabs>
      </Grid>      
      <Grid container justifyContent="flex-start" direction="row" wrap="nowrap" columns={2}>
        <Container sx={{margin: 0}} fixed maxWidth="sm">
          <Stack sx={{width: messageGridHeight, margin: 0, bottom: 0, position: 'fixed'}}>
            {/* this should probably be it's own component */}
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
              sx={{padding: 1}}
              InputProps={{endAdornment: <Button onClick={sendMessage}>Send</Button>}}
            />
          </Stack>
        </Container>
      </Grid>
    </>
  )
};

export default mobileDmRooms;

// [
//   {
//     id: 'e6202e23-a450-4b88-9d5a-f4a195f67a68',
//     lastSeen: null,
//     memberId: 'dc4725cc-4b27-453f-b662-91f7553b1a84',
//     recipientId: '9fa6f32d-7284-415a-a576-36aaca82c400',
//     convoPartnerId: 'dc4725cc-4b27-453f-b662-91f7553b1a84',
//     newMessage: null
//   },
//   {
//     id: '9dce2299-2ead-4150-a9b5-271264e94737',
//     lastSeen: null,
//     memberId: '9fa6f32d-7284-415a-a576-36aaca82c400',
//     recipientId: '1820250e-b1ce-4b95-93aa-587bd5014730',
//     convoPartnerId: '1820250e-b1ce-4b95-93aa-587bd5014730',
//     newMessage: '9fa6f32d-7284-415a-a576-36aaca82c400'
//   },
//   {
//     id: '483a3004-2b88-4395-8ee2-634484ec3169',
//     lastSeen: null,
//     memberId: '9fa6f32d-7284-415a-a576-36aaca82c400',
//     recipientId: 'c10e267c-ff9d-4c76-9ebf-ee97c34f6db2',
//     convoPartnerId: 'c10e267c-ff9d-4c76-9ebf-ee97c34f6db2',
//     newMessage: '9fa6f32d-7284-415a-a576-36aaca82c400'
//   },
//   {
//     id: 'f7c08b4f-8c85-4f32-bc44-89cb1b6dbff7',
//     lastSeen: null,
//     memberId: '9fa6f32d-7284-415a-a576-36aaca82c400',
//     recipientId: '0017b07e-c030-4e9a-897c-14a6206680fb',
//     convoPartnerId: '0017b07e-c030-4e9a-897c-14a6206680fb',
//     newMessage: '9fa6f32d-7284-415a-a576-36aaca82c400'
//   }
// ],