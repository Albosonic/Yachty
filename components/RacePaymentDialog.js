import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';

const RacePaymentDialog = ({open, setOpenDialog}) => {
  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
    >
      <DialogContent>
        <Typography>See Race Chair for Payment Options</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Close</Button>
      </DialogActions>
    </Dialog>   
  )
}

export default RacePaymentDialog;