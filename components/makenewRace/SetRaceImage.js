import { useState } from "react";
import { useDispatch } from "react-redux";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, IMG_BUCKET } from "@/lib/clients/s3-client";
import { Box, Button, Fab, Grid, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import { useMutation } from "@apollo/client";
import uuid4 from "uuid4";
import { UPDATE_YC_LOGO_KEY } from "@/lib/gqlQueries/logoKey";
import { resizeLetterHead, resizeYcEventPoster } from "@/lib/utils/imgResizer";
import { UPDATE_LOGO, UPDATE_PROFILE_PICTURE, UPDATE_VESSEL_IMAGE, YC_EVENT, updateLogo } from "@/slices/actions/authActions";
import { makeNewRaceFieldAct } from "@/slices/actions/workingRaceActions";

const SetRaceImage = () => {
  const dispatch = useDispatch();
  const [image, setImage] = useState({src: null,fileDatum: null,imgKey: null});
  
  const [editing, setEditing] = useState(true);
  const moreThan600px = useMediaQuery('(min-width:600px)');
  const {fileDatum, src, imgKey} = image;
  
  const handleChange = async (e) => {
    const {files} = e.target;
    const file = files[0];
    let imageObject = {
      fileDatum: file,
      imgKey: uuid4(),
      src: URL.createObjectURL(file),
    }
    const resizedFile = await resizeYcEventPoster(file);
    imageObject.fileDatum = resizedFile;
    setImage(imageObject);
  };

  const resetForm = () => {    
    setImage({src: null, fileDatum: null, imgKey: null});
  }

  const sendToRedux = () => {
    dispatch(makeNewRaceFieldAct({imageObj: image}))    
  }

  const fabHandler = editing ? sendToRedux : resetForm;

  const handleSubmit = async () => {
    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: fileDatum,
      ContentType: 'image/png'
    };
    const results = await s3Client.send(new PutObjectCommand(params));
    if (results.$metadata.httpStatusCode === 200) {
      resetForm();      
    } else {
      console.error('whoops :', results)
    }
  }
  const inputStyle = src ? { background: `url(${src}) no-repeat`, backgroundSize: "600px 400px" } : {};
  const imgWidthAndHeight = moreThan600px ? '45%' : '100%';
  return (
    <>      
      <Stack alignItems="center">
        {image.src &&
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
              src={image.src}
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
          </>
        }
        {!image.src &&
          <input
            onChange={(e) => handleChange(e)}
            type="file" 
            id="fileUpload" 
            accept=".jpg, .jpeg, .png"
            style={{
              ...inputStyle,              
              width: '90%',
              maxWidth: 500,
            }}
          />
        }
        
        {/* <Grid sx={{margin: 2}} >
          <Button variant="outlined" onClick={handleSubmit}>Submit Image</Button>
        </Grid>       */}
      </Stack>
    </>
  )
}

export default SetRaceImage;