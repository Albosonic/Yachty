import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Fab, Grid, Stack, TextField, Typography } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';

const INSERT_RACE_RELEASE = gql`
  mutation inserRaceRelease($content: String!, $name: String!, $ycId: uuid!) {
  insert_race_release_forms_one(object: {content: $content, name: $name, yachtClubId: $ycId}) {
    name
  }
}
`;

const CreateReleaseDialog = ({ setOpenDialog, open, closeMenu, refetch }) => {
  const logo = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const profilePic = useSelector(state => state.auth.member.profilePic);
  const [formErrors, setFormErrors] = useState({
    nameError: false,
    contentError: false,
  });

  const [releaseForm, setReleaseForm] = useState({content: '', name: ''});
  const [insertRelease, {loading}] = useMutation(INSERT_RACE_RELEASE)
  
  const addRelease = async () => {    
    const {content, name} = releaseForm;
    if (content === '') return setFormErrors({...formErrors, contentError: true})
    if (name === '') return setFormErrors({...formErrors, nameError: true})
    
    const resp = await insertRelease({variables: {
      content,
      name,
      ycId
    }});
    
    closeMenu(null);
    refetch();
    setOpenDialog(false);    
  }

  const closeDialog = () => {
    closeMenu(null);
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
              alt="race chair photo"
              src={logo}
            />
            <Typography sx={{ lineHeight: 2 }} variant='h6'>{name}</Typography>
            <Avatar src={profilePic} aria-label='race chair pic' />
          </Grid>
        </Grid>
        <TextField
          autoFocus
          multiline
          minRows={1}
          margin="dense"
          id="release-text-field"
          label="Release Form Name"
          type="name"          
          variant="standard"
          value={releaseForm.name}
          onChange={(e) => setReleaseForm({...releaseForm, name: e.target.value})}
        />
        <TextField
          autoFocus
          multiline
          minRows={4}
          margin="dense"
          id="race-chair-commentary"
          label="Release Form Text"
          type="summary"
          fullWidth
          variant="standard"          
          value={releaseForm.content}
          onChange={(e) => setReleaseForm({...releaseForm, content: e.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>close</Button>
        <Button onClick={addRelease}>Add</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateReleaseDialog;

// In consideration of being permited to partcipate in the Benicia Yacht Club races,
// for myself and my heirs, next of kin, legal representatives, successors, and assigns,
// and in consideration of acceptance to participate in such races:

// (a) I acknowledge that a sailing race has inherent risks and dangers and hereby
// assume those risks and dangers. These risks include but are not limited to
// personal injury and death and damage to and or loss of equipment and the sailing
// vessel itself through some failure of the vessel, collision with other vessels, debris,
// or animals as well as loss due to adverse weather conditions and seas.

// (b) I waive and release to the fullest extent permitted by law any and all claims
// that I may have or that may arise against Benicia Yacht Club and any other host
// club, their officers, directors, members, committee members, volunteers,
// employees, advisors, and agents or any one or more of them, or their executors,
// administrators, heirs, next of kin, successors or assigns, including any and all
// claims for damages caused by the active or passive negligence of any of them
// arising out of my partcipation in the race or its related actvites.

// (c) I further expressly agree the foregoing release and waiver is intended to be as

// broad and inclusive as is permitted by law and that if any portion, clause or sub-
// clause hereof is held invalid, it is agreed that the balance shall, notwithstanding,

// continue in full force and effect. I have carefully read this agreement and fully
// understand its contents. I am aware that this is a release of liability and waiver of
// claims and sign it of my free will.

// (d) I grant permission to Benicia Yacht Club and its designees to release or report
// information about my participation in the race and to use for any purpose any
// photograph or video of me or my yacht taken or submitted in connection with the
// race and its actvities.

// (e) This waiver shall apply to all BYC organized races in which I am currently
// participating and all future races organized by BYC or other entities which I choose
// to participate in.
