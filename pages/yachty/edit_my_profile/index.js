import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import ImageUploadField from "@/components/ImageUploadField";
import InsertVesselForm from "@/components/InsertVesselForm";
import NavBar from "@/components/NavBar";
import { UPDATE_PROFILE_PICTURE, UPDATE_VESSEL_IMAGE, updateUserProfilePicture } from "@/slices/actions/authActions";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { UPDATE_PROFILE_PICTURE_HASURA } from "./editMemberProfilegql";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { IMG_BUCKET, s3Client } from "@/pages/s3-client";

const vessel = {
  vesselName: '',
  draft: undefined,
  beam: undefined,
  length: undefined,
  hullMaterial: '',
  type: '',
  id: undefined,
  insuranceCompany: '',
  insuranceNum: '',
  insuranceExpiry: ''
} 

const cleanForm = {
  bio: '',
  ...vessel
}

const EditMemberProfile = ({props}) => {
  const dispatch = useDispatch();
  const [updateProfilePic, {loading: loadingProfilePic}] = useMutation(UPDATE_PROFILE_PICTURE_HASURA);
  const profilePicture = useSelector(state => state.auth.member?.profilePic);
  const memberId = useSelector(state => state.auth.member?.id);
  const [vesselImg, setVesselImg] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [addingVessel, setAddingVessel] = useState(false);
  const [profileData, setProfileData] = useState({...cleanForm})
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);
  const [vesselData, setVesselData] = useState({...vessel});

  const uploadProfilePic = async () => {
    const {fileDatum, src, imgKey} = profilePic;
    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: fileDatum,
      ContentType: 'image/png'
    };
    const results = await s3Client.send(new PutObjectCommand(params));
    if (results.$metadata.httpStatusCode === 200) {
      const imgPath = `${IMG_BUCKET}${imgKey}`;
      const resp = await updateProfilePic({variables: { profilePic: imgPath, memberId: memberId}});
      const pic = resp.data.update_yc_members.returning[0].profilePic;
      dispatch(updateUserProfilePicture(pic));
    } else {
      console.error('error loading profile picture');
    }
    setEditingProfilePicture(!editingProfilePicture);
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
              <Button onClick={uploadProfilePic}>Close and Submit</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Stack alignItems="center" spacing={2}>
          <Grid container justifyContent="flex start">
            <IconButton onClick={() => setEditingProfilePicture(!editingProfilePicture)}>
              <Stack>
                <Grid container justifyContent="space-around">
                  <Typography variant="subtitle2">edit</Typography>
                  <EditIcon sx={{width: 18, height: 18}} />
                </Grid>
                <Avatar sx={{width: 60, height: 60}} alt="member pic" src={profilePicture} />            
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
                <InsertVesselForm setVesselToParent={setVesselData} />
              </>
              )
            }
        </Stack>
      </Paper>
    </>
  )
}

export default EditMemberProfile;

