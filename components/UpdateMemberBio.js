import { updateMemberBioAct } from "@/slices/actions/authActions";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Alert, Button, Grid, Snackbar, Stack, TextField, Typography } from "@mui/material";
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
  });

  const handleUpdateBio = async () =>{
    await updateBio({variables: {memberId, bio: memberBio}});    
    dispatch(updateMemberBioAct(memberBio))
    setShowSuccess(true);
  }

  const handleClose = () => {
    setShowSuccess(false);
  }

  return (
    <Grid width="80%">
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
      />}
      {!editing && 
        <Typography>{bio}</Typography>
      }
    </Grid>
  )
}

export default UpdateMemberBio;