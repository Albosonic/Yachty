import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import ImageUploadField from "@/components/ImageUploadField";
import InsertVesselForm from "@/components/InsertVesselForm";
import NavBar from "@/components/NavBar";
import { UPDATE_PROFILE_PICTURE, UPDATE_VESSEL_IMAGE } from "@/slices/actions/authActions";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const cleanForm = {
  bio: '',
  
}

const EditMemberProfile = ({props}) => {
  const {user} = useUser();
  const [vesselImg, setVesselImg] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [addingVessel, setAddingVessel] = useState(false);
  const [profileData, setProfileData] = useState({...cleanForm})
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);
  
  const uploadProfilePic = async (e) => {
    const results = await s3Client.send(new PutObjectCommand(params));
  }

  return (
    <>
    <NavBar />
      <Paper elevation={4} sx={{margin: 5, padding: 5}}>
        <Dialog
          fullWidth={true}
          maxWidth={'md'}
          open={editingProfilePicture}
        >
          <DialogContent>
            <DialogTitle>Choose a new Photo</DialogTitle>
            <ImageUploadField type={UPDATE_PROFILE_PICTURE} setImageObjToParent={setProfilePic} img={profilePic} />
            <DialogActions>
              <Button onClick={() => setEditingProfilePicture(!editingProfilePicture)}>Close</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Stack alignItems="center" spacing={2}>
          <Grid container justifyContent="flex start">
            <IconButton onClick={() => setEditingProfilePicture(!editingProfilePicture)}>
              <Avatar sx={{width: 70, height: 70}} alt="member pic" src={user?.picture} />
              <Stack>
                <Typography variant="subtitle1">edit</Typography>
                <EditIcon />
              </Stack>
            </IconButton>
            <Typography sx={{marginLeft: 10, marginTop: 4}} variant="h4">
              Edit Member Profile
            </Typography>
          </Grid>
          
          <TextField 
              label="tell us about yourself"
              multiline
              defaultValue="Sailed the 7 seas arg....."
              rows={5}
              fullWidth
              // onChange={}
          />
            <Button onClick={() => setAddingVessel(!addingVessel)}>Add Vessel Image and info</Button>
            {addingVessel && (
              <>
                <ImageUploadField type={UPDATE_VESSEL_IMAGE} setImageObjToParent={setVesselImg} img={vesselImg} />
                <InsertVesselForm />
              </>
              )
            }
        </Stack>
      </Paper>
    </>
  )
}

export default EditMemberProfile;

