import { forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useRouter } from 'next/router';
import EditProfilePic from './EditProfilePic';
import { Grid, Stack } from '@mui/material';
import UpdateName from './UpdateName';
import { demoEditProfileOptionAct } from '@/slices/actions/uxActions';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewUserDialog = ({ open, setOpen }) => {
  
  // const theme = useTheme();
  const dispatch = useDispatch();
  


  const editMyProfile = () => {
    // TODO:
    // create redux for orientationOn flag: boolean
    // onClose flip it on, and open main settings menu
    // fancy css for edit profile button make it glow and pulse.
    // open tool tip to edit profile button that says "Edit Profile here..."
    dispatch(demoEditProfileOptionAct)


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
        <Button onClick={editMyProfile}>close</Button>        
      </DialogActions>
    </Dialog>    
  );
}

export default NewUserDialog;