import { Box, Dialog, DialogContent, Grid, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const CommentsFromChairDialog = ({setOpenDialog, open}) => {
  const logo = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const memberId = useSelector(state => state.auth.member.id);


  // const { id: releaseFormId, content } = data.race_release_forms[0];

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
      onClose={() => setOpenDialog(false)}
    >
      <DialogContent>
        <Grid alignContent="center">
          <Grid container justifyContent="flex-start">
            <Box
              component="img"
              sx={{
                height: 90,
                width: 120,
                marginBottom: 10,
              }}
              alt="yacht club logo"
              src={logo}
            />
          </Grid>
          {/* <Grid container direction="column">
            <Typography sx={{marginTop: 2}}>
              {content}
            </Typography>
          </Grid> */}
        </Grid>
        <TextField
          autoFocus
          multiline
          margin="dense"
          id="sign release"
          label="sign"
          type="email"
          fullWidth
          variant="standard"
          // value={signature}
          // onChange={(e) => setSignature(e.target.value)}
          inputProps={{
            style: {
              fontFamily: 'Shadows Into Light, cursive',
              fontSize: 24
            },
          }}
        />
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={signDoc}>Sign</Button>
      </DialogActions> */}
    </Dialog>
  )
}

export default CommentsFromChairDialog;