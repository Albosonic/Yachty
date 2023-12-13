import { forwardRef, useState } from 'react';
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
  const router = useRouter();  
  const dispatch = useDispatch();
  const memberId = useSelector(state => state.auth.member.id);
  const [openDemo, setOpenDemo] = useState(false);

  const editMyProfile = () => {
    setOpen(false);
    router.replace({
      pathname:'/yachty/edit_my_profile', 
      query: { memberId }
    })
  };  

  const demoInfoDialog = () => {
    dispatch(demoEditProfileOptionAct(true));
    setOpenDemo(true);
  }

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
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
          <Button onClick={demoInfoDialog}>ok</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDemo}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="new-member-dialog"
        
      >
        <DialogTitle sx={{margin: 1}} >Edit Profile</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{margin: 2}} id="new-member-dialog">
            You can update your profile anytime by clicking the icon in the top right like so.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={editMyProfile}>close</Button>
        </DialogActions>
      </Dialog>
    </>

  );
}

export default NewUserDialog;