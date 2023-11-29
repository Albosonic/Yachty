import { updateMemberBioAct } from "@/slices/actions/authActions";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Alert, Box, Button, Fab, Grid, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const UPDATE_MEMBER_BIO = gql`
  mutation updateMemberProfile($memberId: uuid!, $bio: String) {
  update_yc_members(where: {id: {_eq: $memberId}}, _set: {bio: $bio}) {
    returning {
      bio
    }
  }
}`;

const UpdateMemberBio = () => {
  const dispatch = useDispatch();
  const [memberBio, setMemberBio] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [editing, setEditing] = useState(true);

  const memberId = useSelector(state => state.auth.member.id);
  const bio = useSelector(state => state.auth.member.bio);
  const [updateBio, {loading: updateLoading}] = useMutation(UPDATE_MEMBER_BIO);

  useEffect(() => {
    if (bio) {
      setMemberBio(bio);
      setEditing(false);
    }
  },[bio]);

  const handleUpdateBio = async () =>{
    await updateBio({variables: {memberId, bio: memberBio}});    
    dispatch(updateMemberBioAct(memberBio));
        setShowSuccess(true);
  }

  const handleClose = () => {
    setShowSuccess(false);
    setEditing(false);
  }

  return (
    <Stack width="80%" alignItems="center">
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Success!!
        </Alert>
      </Snackbar>
      {editing && 
        <TextField 
          label="tell us about yourself"
          multiline
          placeholder="Sailed the 7 seas arg....."
          value={memberBio}
          onChange={(e) => setMemberBio(e.target.value)}
          fullWidth
          rows={5}
          InputProps={{endAdornment: <Button sx={{alignSelf: "flex-end"}} onClick={handleUpdateBio}>Set</Button>}}
        />        
      }
      {!editing && 
        <Paper sx={{padding: 4}}>
          <Stack spacing={2} sx={{minWidth: 300}}>
            <Fab sx={{margin: 0}} onClick={() => setEditing(true)} size="small" color="primary" sx={{margin: 3, alignSelf: 'flex-end'}}>
              <EditIcon />
            </Fab>
            <Typography variant="body1">{bio}</Typography>              
          </Stack>
        </Paper>
      }
    </Stack>
  )
}

export default UpdateMemberBio;