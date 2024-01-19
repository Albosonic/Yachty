import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { GET_USERS_ROOM } from "@/lib/gqlQueries/dmgql";
import { INSERT_ROOM } from "@/lib/gqlQueries/allMembersgql";
import { useMutation } from "@apollo/client";
import client from "@/lib/clients/apollo-client";
import { pollUserRooms } from "@/slices/actions/msgActions";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

export const cleanDialog = {
  open: false,
  active: false,
  duesOwed: 0,
  email: '',
  name: '',
  bio: '',
  profilePic: '',
  vessels: [],
  id: '',
}

const MemberInfoDialog = ({openDialog, setOpen}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const memberId = useSelector(state => state.auth.member.id);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [createDMRoom, { loading: dMRoomLoading }] = useMutation(INSERT_ROOM);

  const {
    open,
    name: memberName,
    email: memberEmail,
    bio: memberBio,
    profilePic: memberPic,
    vessels,
    id: targetMemberId,
  } = openDialog;

  const memberVessel = vessels[0];

  const hullMaterial = memberVessel?.hullMaterial;
  const length = memberVessel?.length;
  const img = memberVessel?.img;
  const make = memberVessel?.make;
  const model = memberVessel?.model;
  const beam = memberVessel?.beam;
  const draft = memberVessel?.draft;
  const marina = memberVessel?.marina;
  const sailNumber = memberVessel?.sailNumber;
  const specialNotes = memberVessel?.specialNotes;
  const type = memberVessel?.type;
  const slip = memberVessel?.slip;

  const handleClose = async () => {
    setOpen({...cleanDialog})
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

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
      onClose={() => setOpen({...cleanDialog})}
    >
      <DialogContent>
        <Grid container justifyContent="space-between">
          <DialogTitle>{ memberName }</DialogTitle>
          <Avatar alt="Profile Pic" src={memberPic} />
        </Grid>
        <Grid container justifyContent="space-around">
          <Box
            component="img"
            sx={{
              height: 200,
              width: 200,
              marginBottom: 2,
              borderRadius: 3
            }}
            alt="The house from the offer."
            src={img || "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/db10f677-4c20-49dc-95eb-88d3ff3aae8c"}
          />
          <Stack spacing={.5}>
            {make && <DialogContentText>{`make: ${make}`}</DialogContentText>}
            {memberEmail && <DialogContentText>{`email: ${memberEmail}`}</DialogContentText>}
            {make && <DialogContentText>{`make: ${make}`}</DialogContentText>}
            {model && <DialogContentText>{`model: ${model}`}</DialogContentText>}
            {length && <DialogContentText>{`length: ${length}`}</DialogContentText>}
            {beam && <DialogContentText>{`beam: ${beam}`}</DialogContentText>}
            {draft && <DialogContentText>{`draft: ${draft}`}</DialogContentText>}
            {sailNumber && <DialogContentText>{`sail number: ${sailNumber}`}</DialogContentText>}
            {marina && <DialogContentText>{`marina: ${marina}`}</DialogContentText>}
            {slip && <DialogContentText>{`slip: ${slip}`}</DialogContentText>}
            {hullMaterial && <DialogContentText>{`hullMaterial: ${hullMaterial}`}</DialogContentText>}
            {length && <DialogContentText>{`length: ${length}`}</DialogContentText>}
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

export default MemberInfoDialog;