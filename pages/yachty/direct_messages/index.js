import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { INSERT_MESSAGE, POLL_ALL_MESSAGES } from "@/lib/gqlQueries/dmgql";
import useMediaQuery from '@mui/material/useMediaQuery';
import { Avatar, Button, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Stack, TextField, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import { useUser } from "@auth0/nextjs-auth0/client";
import LoadingYachty from "@/components/LoadingYachty";
import DmRoom from "@/components/DmRoom";
import { pollUserRooms } from "@/slices/actions/msgActions";
import Msg from "@/components/Message";
import DmMsgFeed from "@/components/DmMsgFeed";

const directMessageFeed = ({props}) => {  
  const dmRooms = useSelector(state => state.msgs.dmRooms);

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

  return (
    <>
      <NavBar />
        <Grid  container justifyContent="flex-start" direction="row" wrap="nowrap" columns={2}>
          <Stack sx={{margin: 0, maxWidth: 500, minWidth: 200, height: '100vh', border: '1px solid grey'}}>
            <List sx={{
              overflow: "hidden",
              overflowY: "scroll",
              height: "100%",
              width: "100%",
              minWidth: 200,
            }}>
              {dmRooms.map((room,  i) => <DmRoom dmRoom={room} key={room.id} />)}
            </List>
          </Stack>
          <DmMsgFeed />
        </Grid>
    </>
  )
};

export default directMessageFeed;

