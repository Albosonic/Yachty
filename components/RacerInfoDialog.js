import { useSelector } from "react-redux";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Stack, Typography } from "@mui/material";

const RacerInfoDialog = ({openDialog, setOpenDialog, handleClose, cleanDialog, directMessage}) => {
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
    signed_race_releases,
  } = openDialog;

  const memberVessel = vessels && vessels.length > 0 ? vessels[0] : null;
  console.log('openDialog ==========', openDialog)
  const signature = signed_race_releases[0]?.signature;
  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
      onClose={() => setOpenDialog({...cleanDialog})}
    >
    <DialogContent>
      <Grid container wrap="nowrap" justifyContent="space-between">
        <Box component="img" sx={{ height: 90, width: 120 }} alt="yacht club logo" src={yachtClubByYachtClub?.logo} />
        <DialogTitle>{ `${yachtClubByYachtClub?.name} Member` }</DialogTitle>
        <Avatar alt="Profile Pic" src={memberPic} />
      </Grid>              
        <Stack alignItems="center">
          <Typography sx={{margin:2}}> Vessel: {memberVessel?.vesselName}</Typography>          
          <Grid container justifyContent="space-around" sx={{width: '100%'}}>            
            <Box
              component="img"
              sx={{
                height: 200,
                width: 200,                
                borderRadius: 3,                
              }}
              alt="The house from the offer."
              src={memberVessel?.img}
            />            
            <Stack spacing={1}>
              {signature &&
                <Grid container sx={{minWidth: 250, width: '100%'}} justifyContent="space-between">
                  <Typography sx={{color: 'green'}}>Release Signed: </Typography>
                  <Typography 
                    color="success"
                    sx={{fontFamily: 'Shadows Into Light, cursive', color: 'green'}}
                  >
                    {signature}
                  </Typography>
                </Grid>
              }
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