import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { IMG_BUCKET, s3Client } from "@/lib/clients/s3-client";
import { UPDATE_PROFILE_PICTURE_HASURA } from "@/lib/gqlQueries/editMemberProfilegql";
import { UPDATE_PROFILE_PICTURE, updateUserProfilePicture } from "@/slices/actions/authActions";
import ImageUploadField from "@/components/ImageUploadField";

const EditProfilePic = () => {
  const dispatch = useDispatch();
  const [profilePic, setProfilePic] = useState(null);
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);
  const profilePicture = useSelector(state => state.auth.member?.profilePic);
  const memberId = useSelector(state => state.auth.member?.id);
  const [updateProfilePic, {loading: loadingProfilePic}] = useMutation(UPDATE_PROFILE_PICTURE_HASURA);

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

  return (
    <>
      <Dialog
          fullWidth={true}
          maxWidth='md'
          open={editingProfilePicture}
        >
          <DialogContent>
            <DialogTitle>Choose a new Photo</DialogTitle>
            <ImageUploadField 
              type={UPDATE_PROFILE_PICTURE} 
              setImageObjToParent={setProfilePic} 
              img={profilePic}
              title=""
            />
            <DialogActions>
              <Button onClick={() => setEditingProfilePicture(!editingProfilePicture)}>Back</Button>
              <Button onClick={uploadProfilePic}>Submit</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <IconButton onClick={() => setEditingProfilePicture(!editingProfilePicture)}>
          <Stack>
            <Grid container justifyContent="space-between">
              <Typography variant="subtitle2">edit</Typography>
              <EditIcon sx={{width: 18, height: 18}} />
            </Grid>
            <Avatar sx={{width: 60, height: 60}} alt="member pic" src={profilePicture} />
          </Stack>
        </IconButton>
    </>
  )
}

export default EditProfilePic;