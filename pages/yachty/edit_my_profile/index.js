import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQuery } from "@apollo/client";
import ImageUploadField from "@/components/ImageUploadField";
import InsertVesselForm from "@/components/InsertVesselForm";
import NavBar from "@/components/NavBar";
import { IMG_BUCKET, s3Client } from "@/lib/clients/s3-client";
import { INSERT_MEMBER_VESSEL, UPDATE_MEMBER_AND_VESSEL, UPDATE_PROFILE_PICTURE_HASURA, UPDATE_YC_MEMBER_BIO } from "@/lib/gqlQueries/editMemberProfilegql";
import { UPDATE_PROFILE_PICTURE, UPDATE_VESSEL_IMAGE, updateUserProfilePicture } from "@/slices/actions/authActions";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";

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
  const profilePicture = useSelector(state => state.auth.member?.profilePic);
  const vesselInfo = useSelector(state => state.auth?.member.vessels);

  const [updateProfilePic, {loading: loadingProfilePic}] = useMutation(UPDATE_PROFILE_PICTURE_HASURA);
  const [insertMemberVessel, {loading: insertVesselLoading}] = useMutation(INSERT_MEMBER_VESSEL);
  const [updateMemberAndVessel, {loading: updateMemberAndVesselLoading}] = useMutation(UPDATE_MEMBER_AND_VESSEL);
  const [updateMemberBio, {loading: updateMemberLoading}] = useMutation(UPDATE_YC_MEMBER_BIO);

  // query member, and vessel info. If no vessel run insert vessel. if vessel exists 
  // run update vessel info.
  // always run update member info.
  const [vesselImg, setVesselImg] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [addingVessel, setAddingVessel] = useState(false);
  const [memberUpdateData, setMemberUpdateData] = useState({...cleanMemberUpdateData})
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
  };

  const submitMemberBio = async () => {
    const { bio } = memberUpdateData;
    await updateMemberBio({variables:{memberId, bio}})
  }


  const submitVesselAndMemberInfo = async () => {
    let vesselImgPath = '';
    const { bio } = memberUpdateData;
    const { beam, draft, hullMaterial, insuranceCompany, insuranceExpiry, insuranceNum, length, type, vesselName } = vesselData;
    const {fileDatum, src, imgKey} = vesselImg;
    
    if (vesselImg !== null) {
      const params = {
        Bucket: 'yachty-letter-heads',
        Key: imgKey,
        Body: fileDatum,
        ContentType: 'image/png'
      };
      
      const results = await s3Client.send(new PutObjectCommand(params));
      if (results.$metadata.httpStatusCode === 200) {
        vesselImgPath = `${IMG_BUCKET}${imgKey}`;
      } else {
        console.error('error loading profile picture');
      }
    }
    if(vesselInfo.length === 0) {
      await insertMemberVessel({variables: {
        ownerId: memberId,
        draft: draft || null,
        beam: beam || null,
        hullMaterial: hullMaterial || null,
        length: length || null,
        type: type || null,
        vesselName: vesselName || null,
        img: vesselImgPath || null,
        insuranceInfo: { no: insuranceNum, company: insuranceCompany, expires: insuranceExpiry },
      }})
      if (bio === '') await updateMemberBio({variables:{memberId, bio}})
    } else {
      console.log('vesselInfo ====', vesselInfo)
    //   $memberId: uuid,
    // $vesselId: uuid, 
    // $bio: String,
    // $beam: Int, 
    // $draft: Int, 
    // $hullMaterial: String, 
    // $img: String, 
    // $insuranceInfo: jsonb, 
    // $length: Int,
    // $ownerId: uuid,
    // $specialNotes: String, 
    // $type: String, 
    // $unafilliatedVesselId: String, 
    // $vesselImage: String, 
    // $vesselName: String, 
      await updateMemberAndVessel({variables: {
        // TODO: this needs some attention. via vessel Id or not.
        // Todo: MISSING VESSEL ID
        // TODO: REVISIT UPDATE VESSEL, MAYBE ONLY INSURANCE INFO ARE REQUIRED. OTHERWISE DELETE, AND ADD NEW.
        // TODO: ALSO, WHEN DOES VESSEL GET INSERTED??...
        bio: bio,
        ownerId: memberId,
        draft: draft || null,
        beam: beam || null,
        hullMaterial: hullMaterial || null,
        length: length || null,
        type: type || null,
        vesselName: vesselName || null,
        insuranceInfo: { no: insuranceNum, company: insuranceCompany, expires: insuranceExpiry },
      }})
    }
  }
  const submit = addingVessel ? submitVesselAndMemberInfo : submitMemberBio;
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
              value={memberUpdateData.bio}
              onChange={(e) => setMemberUpdateData({...memberUpdateData, bio: e.target.value})}
              fullWidth
              rows={5}
          />
            <Button onClick={() => setAddingVessel(!addingVessel)}>Add Vessel Image and info</Button>
            {addingVessel && (
              <>
                <ImageUploadField type={UPDATE_VESSEL_IMAGE} setImageObjToParent={setVesselImg} img={vesselImg} title="Upload Vessel Image" />
                <InsertVesselForm setVesselToParent={setVesselData} formValues={vesselData} />
              </>
              )
            }
          <Button  
            onClick={submit}
            variant="outlined"
          >
            Submit
          </Button>
        </Stack>
      </Paper>
    </>
  )
}

export default EditMemberProfile;

