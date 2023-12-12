import { forwardRef } from 'react';
import { useTheme } from '@emotion/react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import EditProfilePic from './EditProfilePic';
import { Grid, Stack } from '@mui/material';
import UpdateName from './UpdateName';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewUserDialog = ({ open, setOpen }) => {
  const router = useRouter();
  const theme = useTheme();
  const memberId = useSelector(state => state.auth.member.id);


  const editMyProfile = () => {

    // TODO:
    // create redux for orientationOn flag: boolean
    // onClose flip it on, and open main settings menu
    // fancy css for edit profile button make it glow and pulse.
    // open tool tip to edit profile button that says "Edit Profile here..."



    // router.replace({
    //   pathname:'/yachty/edit_my_profile', 
    //   query: { memberId }
    // })
  };  

  const handleClose = () => {
    setOpen(false);
  };

  return (    
    <Dialog
      open={open}      
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="new-member-dialog"
    >
      <DialogTitle>New to Yachty</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{margin: 2}} id="new-member-dialog">
          You can update your profic here.
        </DialogContentText>
        <Stack>
          <EditProfilePic />
          <UpdateName />
        </Stack>        
      </DialogContent>
      <DialogActions>
        <Button onClick={editMyProfile}>go</Button>        
      </DialogActions>
    </Dialog>    
  );
}

export default NewUserDialog;