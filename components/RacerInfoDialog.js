import { useSelector } from "react-redux";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from "@mui/material";

const RacerInfoDialog = ({openDialog, setOpenDialog, handleClose, cleanDialog}) => {
  const memberId = useSelector(state => state.auth.member.id);

  const { 
    open, 
    name: memberName, 
    duesOwed: memberDuesOwed, 
    active: memberActive, 
    email: memberEmail, 
    bio: memberBio, 
    profilePic: memberPic, 
    id: targetMemberId,
    vessels,
    yachtClubByYachtClub,
  } = openDialog;

  const memberVessel = vessels && vessels.length > 0 ? vessels[0] : null;

  return (
    <Dialog
    fullWidth={true}
    maxWidth={'sm'}
    open={open}
    onClose={() => setOpenDialog({...cleanDialog})}
  >
    <DialogContent>
      <Grid container justifyContent="space-between">
        <Box component="img" sx={{ height: 90, width: 120 }} alt="yacht club logo" src={yachtClubByYachtClub?.logo} />
        <Avatar alt="Profile Pic" src={memberPic} />
      </Grid>
      <Stack alignItems="center">
      <DialogTitle>{ `${yachtClubByYachtClub?.name} Member` }</DialogTitle>
      <DialogTitle>{ memberName }</DialogTitle>
      </Stack>          
      <Grid container>
        <Stack alignItems="center">
          <Typography>
            Vessel: {memberVessel?.vesselName}
          </Typography>
          <Box
            component="img"
            sx={{
              height: 200,
              width: 200,
              marginBottom: 2,
            }}
            alt="The house from the offer."
            src={memberVessel?.img} 
          />
        </Stack>
        <Stack sx={{marginTop: 5, marginLeft: 2}}>
          <DialogContentText>
            {memberEmail}
          </DialogContentText>
          <DialogContentText>
            hullMaterial: {memberVessel?.type}
          </DialogContentText>
          <DialogContentText>
            length: {memberVessel?.length}
          </DialogContentText>
          <DialogContentText>
            make: {memberVessel?.make}
          </DialogContentText>
          <DialogContentText>
            model: {memberVessel?.model}
          </DialogContentText>
          <DialogContentText>
            marina: {memberVessel?.marina}
          </DialogContentText>
          <DialogContentText>
            slip: {memberVessel?.slip}
          </DialogContentText>
          <DialogContentText>
            Member Bio: {memberBio}
          </DialogContentText>
        </Stack>
      </Grid>
      <Grid container justifyContent="space-between" >
        <DialogActions>
          <Button onClick={handleClose}>go back</Button>
        </DialogActions>
        {targetMemberId !== memberId && 
        <DialogActions>
          <Button onClick={() => directMessage(targetMemberId)}>Send Message</Button>
        </DialogActions>}
        <DialogActions>

          <Button color="success" onClick={() => handlePayment(memberEmail)}>Dues Paid</Button>
          
        </DialogActions>
      </Grid>
    </DialogContent>
  </Dialog>    
  )  
}

export default RacerInfoDialog;