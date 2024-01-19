import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const NoDmsDialog = ({open, setOpen}) => {
  const router = useRouter()
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id)
  const handleClose = () => {
    setOpen(false)
    router.replace({
      pathname:'/yachty/view_all_members',
      query: { 
        ycId,        
      }
    })    
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogContent>
        <Grid container justifyContent="space-between">
          <DialogTitle>Hello Sailor</DialogTitle>
          {/* <Avatar alt="Profile Pic" src={memberPic} /> */}
        </Grid>
        <Grid container justifyContent="space-around">          
          <Stack spacing={.5}>
            <DialogContentText>
              This is the all members table. Here you can view all club members. 
              Click on a member to view their profile. 
              From their you can even send them a direct message if you like.
              Happy Sailing!
            </DialogContentText>            
          </Stack>
        </Grid>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>                    
      </DialogContent>
    </Dialog>
  )
}

export default NoDmsDialog;