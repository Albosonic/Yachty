import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ClaimSeatDialog = ({open, reserveSeat}) => {  

  const handleClose = (open, name) => {
    reserveSeat(open, name)
  };

  return (
    <React.Fragment>
      <Dialog
        open={open.open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const name = formJson.name;
            console.log(name);
            handleClose(open, name);  
          },
        }}
      >
        <DialogTitle>Claim Seat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your name here and press claim button below
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Claim</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default ClaimSeatDialog