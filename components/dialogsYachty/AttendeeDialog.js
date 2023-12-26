import { useDispatch, useSelector } from "react-redux";

import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import client from "@/lib/clients/apollo-client";
import { pollUserRooms } from "@/slices/actions/msgActions";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { INSERT_ROOM } from "@/lib/gqlQueries/allMembersgql";

const AttendeeDialog = ({ data, setOpenDialog }) => {  
  const router = useRouter();
  const dispatch = useDispatch();
  const memberId = useSelector(state => state.auth.member.id);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const burgee = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const [createDMRoom, { loading: dMRoomLoading }] = useMutation(INSERT_ROOM);  

  const handleClose = async () => {
    setOpenDialog(false)
  }

  const directMessage = async (recipientId) => {
    let roomId = null;
    const queryResp = await client.query({
      query: GET_USERS_ROOM,
      fetchPolicy: 'no-cache',
      variables: {
        recipientId,
        memberId,
      }
    })
    const userRmData = queryResp?.data?.user_rooms;
    if (userRmData.length === 0) {
      const resp = await createDMRoom({
        variables: {
          memberId,
          recipientId,
          ycId,
        }
      });
      roomId = resp.data.insert_user_rooms_one.id;
      dispatch(pollUserRooms());
    } else {
      roomId = queryResp?.data?.user_rooms[0].id;
    }

    const pathSegment = 'mobile_dm_rooms'
    router.push({
      pathname: `/yachty/${pathSegment}`,
      query: { rid: roomId },
    })
  }
  const {
    open, 
    targetMemberId, 
    memberName, 
    memberPic, 
    img, 
    memberBio,
    totalTickets,
    ticketsPaid,
    ticketsUnpaid,
    totalDinners,
    dinnersPain,
    dinnersUnpaid,

  } = data;

  return (

    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open || false}
      onClose={() => setOpenDialog({open: false})}
    >
    <DialogContent>
      <Grid container justifyContent="space-between">
        <DialogTitle>{ memberName }</DialogTitle>
        <Avatar alt="Profile Pic" src={burgee} />
      </Grid>
      <Grid container justifyContent="flex-start">
        <Box
          component="img"
          sx={{
            height: 180,
            width: 180,
            marginBottom: 2,
            borderRadius: 3
          }}
          alt="member image"
          src={memberPic || "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/db10f677-4c20-49dc-95eb-88d3ff3aae8c"}
        />
        <Stack alignItems="flex-start">
          <Typography variant="h5">Event Reservations: {totalTickets}</Typography>
          <Typography variant="h5">Dinner Reservations: {totalDinners}</Typography>
        </Stack>
      </Grid>
      <DialogContentText>{memberBio}</DialogContentText>
      <Grid container justifyContent="space-between" >
        <DialogActions>
          <Button onClick={handleClose}>go back</Button>
        </DialogActions>
        {targetMemberId !== memberId && 
        <DialogActions>
          <Button onClick={() => directMessage(targetMemberId)}>Send Message</Button>
        </DialogActions>}
        {/* <DialogActions>
          <Button color="success" onClick={() => handlePayment(memberEmail)}>Dues Paid</Button>
        </DialogActions> */}
      </Grid>
    </DialogContent>
  </Dialog>
  )
}
export default AttendeeDialog;