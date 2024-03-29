import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Box, Button, CircularProgress, Fab, Snackbar, TextField, useMediaQuery } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { IMG_BUCKET, s3Client } from "@/lib/clients/s3-client";
import PublishIcon from '@mui/icons-material/Publish';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import ImageUploadField from "./ImageUploadField";
import { UPDATE_VESSEL_IMAGE, updateNewVesselAct, updateVesselImgAct } from "@/slices/actions/authActions";
import { gql, useMutation, useQuery } from "@apollo/client";

const UPDATE_VESSEL_IMG_BY_OWNER_ID = gql`
  mutation updateVesselImageByOwnerId($ownerId: uuid!, $img: String) {
  update_vessels(where: {ownerId: {_eq: $ownerId}}, _set: {img: $img}) {
    affected_rows
  }
}`;

const GET_VESSEL_IMG_BY_OWNER_ID = gql`
  query getVesselByImgByOwnerid($ownerId: uuid) {
    vessels(where: {ownerId: {_eq: $ownerId}}) {
      img
    }
  }`;

const INSERT_VESSEL_AND_IMAGE = gql`
  mutation insertVesselAndImage($ownerId: uuid!, $img: String) {
  insert_vessels_one(object: {ownerId: $ownerId, img: $img}) {
    id
    img
    ownerId
  }
}
  `;

const UploadVesselImage = () => {
  const dispatch = useDispatch();

  const [showSuccess, setShowSuccess] = useState(false);
  const [vesselImg, setVesselImg] = useState(null);
  const [editing, setEditing] = useState(true);

  const [updateVesselImage, {loading: vesselImgLoading}] = useMutation(UPDATE_VESSEL_IMG_BY_OWNER_ID);
  const [insertVesselAndImage, {loading: inssertVesselLoading}] = useMutation(INSERT_VESSEL_AND_IMAGE);

  const vesselIdExists = useSelector(state => !!state?.auth?.member?.vessels[0]?.id);
  const memberId = useSelector(state => state.auth.member.id);

  const {error: vesselError, loading: vesselLoading, data: vesselData} = useQuery(GET_VESSEL_IMG_BY_OWNER_ID, {variables: {ownerId: memberId}})


  const moreThan600px = useMediaQuery('(min-width:600px)');

  useEffect(() => {
    if (vesselLoading) return;
    if (vesselData.vessels.length > 0) {
      setVesselImg({exists: true, src: vesselData.vessels[0]?.img});
      setEditing(false)
    }
  },[vesselData])

  const handleClose = () => {
    setEditing(false)
    setShowSuccess(false)
  }

  const uploadVesselImage = async () => {
    const {fileDatum, src, imgKey} = vesselImg;

    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: fileDatum,
      ContentType: 'image/png'
    };

    const results = await s3Client.send(new PutObjectCommand(params));
    const imgPath = `${IMG_BUCKET}${imgKey}`;
    if (vesselIdExists) {      
      await updateVesselImage({variables: {ownerId: memberId, img: imgPath}})
      dispatch(updateVesselImgAct(imgPath));
    } else {      
      const resp = await insertVesselAndImage({variables: {ownerId: memberId, img: imgPath, vesselImg: imgPath}});
      dispatch(updateNewVesselAct({ownerId: memberId, img: imgPath, id: resp.data.insert_vessels_one.id}))
    }  
    setShowSuccess(true);
    setEditing(false);
  };

  const resetForm = () => {
    setVesselImg(null);
    setEditing(true)
  }

  const imgWidthAndHeight = moreThan600px ? '45%' : '100%';
  const fabHandler = editing ? uploadVesselImage : resetForm;
  if (vesselLoading || vesselImgLoading) return <CircularProgress />;
  return (
    <>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Success
        </Alert>
      </Snackbar>
      {vesselImg &&
        <>
          <Box
            component="img"
            sx={{
              borderRadius: 3,
              height: imgWidthAndHeight,
              width: imgWidthAndHeight,
              marginBottom: 2,
            }}
            alt="Vessel Image"
            src={vesselImg?.src}             
          />              
          <Fab 
            onClick={fabHandler}
            sx={{
              background: 'white',
              position: 'relative',
              top: -100,
            }}>
            {editing ? <PublishIcon /> : <EditIcon />}
          </Fab>
      </>}
      {!vesselImg && <ImageUploadField type={UPDATE_VESSEL_IMAGE} setImageObjToParent={setVesselImg} img={vesselImg} title="Upload Vessel Image" />}
    </>
  )
}

export default UploadVesselImage;