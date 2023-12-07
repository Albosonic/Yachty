import { useTheme } from '@emotion/react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useRouter } from 'next/router';
import { Fragment, forwardRef, useState } from 'react';
import { useSelector } from 'react-redux';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewUserDialog = ({ open, setOpen }) => {
  const router = useRouter();
  const theme = useTheme();
  const memberId = useSelector(state => state.auth.member.id);


  const editMyProfile = () => {
    router.replace({
      pathname:'/yachty/edit_my_profile', 
      query: { memberId }
    })
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
      <DialogTitle>New to Yachty?</DialogTitle>
      <DialogContent>
        <DialogContentText id="new-member-dialog">
          You can update your member profile here.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={editMyProfile}>go</Button>        
      </DialogActions>
    </Dialog>    
  );
}

export default NewUserDialog;