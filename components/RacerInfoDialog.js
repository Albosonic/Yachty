import { useSelector } from "react-redux";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";

const RacerInfoDialog = ({openDialog, setOpenDialog, handleClose, cleanDialog, directMessage}) => {
  const memberId = useSelector(state => state.auth.member.id);
  const moreThan600px = useMediaQuery('(min-width:600px)');
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
    signed_race_releases,
  } = openDialog;

  const memberVessel = vessels[0];  
  const signature = signed_race_releases[0]?.signature;
  const hullMaterial = memberVessel?.hullMaterial
  const length = memberVessel?.length
  const make = memberVessel?.make
  const model = memberVessel?.model
  const marina = memberVessel?.marina
  const slip = memberVessel?.slip
  const vesselName = memberVessel?.vesselName
  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
      onClose={() => setOpenDialog({...cleanDialog})}
    >
    <DialogContent>
      <Grid container justifyContent="space-between" sx={{marginTop: 1, marginBottom: 5}}>
        <Box component="img" sx={{ height: 90, width: 120 }} alt="yacht club logo" src={yachtClubByYachtClub?.logo} />
        {moreThan600px && <DialogTitle>{ `${yachtClubByYachtClub?.name} Member` }</DialogTitle>}
        <Avatar alt="Profile Pic" src={memberPic} sx={{margin: 2}} />
      </Grid>
      {!moreThan600px &&
        <Grid container justifyContent="center">
          <DialogTitle>{ `${yachtClubByYachtClub?.name} Member` }</DialogTitle>
        </Grid>
      }
      <Stack alignItems="center">        
        <Grid container justifyContent="space-around" sx={{width: '100%'}}>
          <Box
            component="img"
            sx={{
              height: 200,
              width: 200,
              borderRadius: 3,
            }}
            alt="vessel image"
            src={memberVessel?.img}
          />
          <Stack spacing={1}>
            {signature &&
              <Grid container sx={{minWidth: 250, width: '100%'}} justifyContent="flex-start">
                <Typography sx={{color: 'green'}}>Release Signed:</Typography>&nbsp;
                <Typography color="success" sx={{fontFamily: 'Shadows Into Light, cursive', color: 'green'}}>{signature}</Typography>
              </Grid>
            }            
            <DialogContentText>{memberEmail}</DialogContentText>
            {vesselName && <DialogContentText>Vessel Name: {memberVessel?.vesselName}</DialogContentText>}
            {hullMaterial && <DialogContentText>hullMaterial: {hullMaterial}</DialogContentText>}
            {length && <DialogContentText>length: {length}</DialogContentText>}
            {make && <DialogContentText>make: {make}</DialogContentText>}
            {model && <DialogContentText> model: {model}</DialogContentText>}
            {marina && <DialogContentText>marina: {marina}</DialogContentText>}
            {slip && <DialogContentText>slip: {slip}</DialogContentText>}
          </Stack>
        </Grid>
      </Stack>
      <Stack sx={{marginTop: 5, marginLeft: 2}}>
        <DialogContentText>
          Member Bio: {memberBio}
        </DialogContentText>
      </Stack>
      <Grid container justifyContent="space-between" >
        <DialogActions>
          <Button onClick={handleClose}>go back</Button>
        </DialogActions>
        {targetMemberId !== memberId &&
        <DialogActions>
          <Button onClick={() => directMessage(targetMemberId)}>Send Message</Button>
        </DialogActions>}
      </Grid>
    </DialogContent>
  </Dialog>
  )
}

export default RacerInfoDialog;