import { useState } from "react";
import { Alert, Button, Snackbar, TextField } from "@mui/material";

const UpdateMemberBio = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = async () =>{
    setShowSuccess(true);
  }
  const handleClose = () => {
    setShowSuccess(false)
  }
  return (
    <>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Success
        </Alert>
      </Snackbar>
      <TextField 
        label="tell us about yourself"
        multiline
        placeholder="Sailed the 7 seas arg....."
        value={memberUpdateData.bio}
        onChange={(e) => console.log('handler')}
        fullWidth
        rows={5}
        InputProps={{endAdornment: <Button sx={{alignSelf: "flex-end"}} onClick={() => handleClick}>Set</Button>}}
      />
    </>
  )
}

export default UpdateMemberBio;