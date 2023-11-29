import { gql, useMutation } from "@apollo/client";
import { Alert, Button, Grid, Snackbar, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

export const UPDATE_MEMBER_BIO = gql`
  mutation updateMemberProfile($memberId: uuid!, $bio: String) {
  update_yc_members(where: {id: {_eq: $memberId}}, _set: {bio: $bio}) {
    returning {
      bio
    }
  }
}`;

const UpdateMemberBio = () => {
  const memberId = useSelector(state => state.auth.member.id);
  const [memberBio, setMemberBio] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [updateBio, {loading: updateLoading}] = useMutation(UPDATE_MEMBER_BIO);

  const handleUpdateBio = async () =>{
    await updateBio({variables: {memberId, bio: memberBio}});
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
    </Grid>
  )
}

export default UpdateMemberBio;