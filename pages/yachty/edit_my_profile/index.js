import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQuery } from "@apollo/client";
import ImageUploadField from "@/components/ImageUploadField";
import InsertVesselForm from "@/components/InsertVesselForm";
import NavBar from "@/components/NavBar";
import { IMG_BUCKET, s3Client } from "@/lib/clients/s3-client";
import { INSERT_MEMBER_VESSEL, UPDATE_MEMBER_AND_VESSEL, UPDATE_PROFILE_PICTURE_HASURA, UPDATE_YC_MEMBER_AS_RACER, UPDATE_YC_MEMBER_BIO } from "@/lib/gqlQueries/editMemberProfilegql";
import { UPDATE_PROFILE_PICTURE, updateIsRacer, updateUserProfilePicture } from "@/slices/actions/authActions";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Fab, FormControlLabel, FormGroup, Grid, IconButton, Paper, Stack, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import YachtySwitch from "@/components/YachtySwitch";
import UpdateMemberBio from "@/components/UpdateMemberBio";
import UploadVesselImage from "@/components/UploadVesselImage";

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
};

const cleanMemberUpdateData = {
  bio: '',
};

const EditMemberProfile = ({props}) => {
  const dispatch = useDispatch();
  const memberId = useSelector(state => state.auth.member?.id);
  const memberIsRacer = useSelector(state => state.auth.member?.isRacer);
  const profilePicture = useSelector(state => state.auth.member?.profilePic);
  const vesselInfo = useSelector(state => state.auth?.member.vessels);

  const [updateProfilePic, {loading: loadingProfilePic}] = useMutation(UPDATE_PROFILE_PICTURE_HASURA);
  // const [insertMemberVessel, {loading: insertVesselLoading}] = useMutation(INSERT_MEMBER_VESSEL);
  const [updateMemberAndVessel, {loading: updateMemberAndVesselLoading}] = useMutation(UPDATE_MEMBER_AND_VESSEL);
  const [updateMemberBio, {loading: updateMemberLoading}] = useMutation(UPDATE_YC_MEMBER_BIO);

  const [updateMemberRacer, {loading: updateMemberRacerLoading}] = useMutation(UPDATE_YC_MEMBER_AS_RACER);

  const [profilePic, setProfilePic] = useState(null);
  const [memberUpdateData, setMemberUpdateData] = useState({...cleanMemberUpdateData})
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);
  const [vesselData, setVesselData] = useState({...vessel});
  const [racerOn, setRacerOn] = useState(false);
  
  useEffect(() => {
    if(vesselInfo.length > 0) setVesselData({...vesselInfo[0]})
    setRacerOn(memberIsRacer);
  }, [memberIsRacer]);

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
  };

  const changeIsRacer = async () => {
    const isRacer = !racerOn;
    await updateMemberRacer({variables: {memberId, isRacer}});
    dispatch(updateIsRacer(isRacer));
    setRacerOn(isRacer);
  }
  
  return (
    <>
    <NavBar />
      <Paper elevation={4} sx={{margin: 5, padding: 5}}>
        <Dialog
          fullWidth={true}
          maxWidth='md'
          open={editingProfilePicture}
        >
          <DialogContent>
            <DialogTitle>Choose a new Photo</DialogTitle>
            <ImageUploadField type={UPDATE_PROFILE_PICTURE} setImageObjToParent={setProfilePic} img={profilePic} />
            <DialogActions>
              <Button onClick={() => setEditingProfilePicture(!editingProfilePicture)}>Back</Button>
              <Button onClick={uploadProfilePic}>Close and Submit</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Stack alignItems="center" spacing={2}>
          <Grid container justifyContent="space-between">
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
            <FormGroup>
              <FormControlLabel
                control={<YachtySwitch onChange={() => changeIsRacer()} sx={{ m: 1 }} checked={racerOn} />}
                label="Race Profile"
              />
            </FormGroup>
          </Grid>
          <UpdateMemberBio />
          <UploadVesselImage />    
          <InsertVesselForm setVesselToParent={setVesselData} formValues={vesselData} />            
        </Stack>
      </Paper>
    </>
  )
}

export default EditMemberProfile;

