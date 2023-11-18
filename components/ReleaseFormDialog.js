import { gql, useMutation, useQuery } from '@apollo/client';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Snackbar, Stack, TextField, Typography, styled } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const GET_RELEASE_FORM_BY_YC_ID = gql`
query getreleaseFormByYcId($ycId: uuid!) {
  race_release_forms(where: {yachtClubId: {_eq: $ycId}}) {
    content
    id
    raceId
  }
}`;

const INSERT_SIGNED_RELEASE = gql`
  mutation insertSignedRelease($memberId: uuid!, $releaseFormId: uuid!, $signature: String) {
  insert_signed_race_release(objects: {memberId: $memberId, releaseFormId: $releaseFormId, signature: $signature}) {
    affected_rows
  }
}
`

const ReleaseFormDialog = ({setOpenDialog, open}) => {
  const [signature, setSignature] = useState('');
  const logo = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const memberId = useSelector(state => state.auth.member.id);
  
  const {error, loading, data} = useQuery(GET_RELEASE_FORM_BY_YC_ID, {variables: {ycId}});
  const [insertSignedForm, {loading: signedFormLoading}] = useMutation(INSERT_SIGNED_RELEASE)
  if (loading) return <CircularProgress />;

  const { id: releaseFormId, content } = data.race_release_forms[0];

  const signDoc = async () => {
    await insertSignedForm({
      variables: {
      memberId,
      releaseFormId,
      signature
    }});
    setOpenDialog(false);
  }
  
  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
      onClose={() => setOpenDialog(false)}
    >
      <DialogContent>
        <Grid alignContent="center">
          <Grid container justifyContent="space-between">              
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
          <Grid container direction="column">              
            <Typography sx={{marginTop: 2}}>
              {content}
            </Typography>                          
          </Grid>
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
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          inputProps={{
            style: { 
              fontFamily: 'Shadows Into Light, cursive',
              fontSize: 24
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={signDoc}>Sign</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReleaseFormDialog;