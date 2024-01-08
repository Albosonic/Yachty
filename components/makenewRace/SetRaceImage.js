import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, IMG_BUCKET } from "@/lib/clients/s3-client";
import { Box, Button, Fab, Grid, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import StartIcon from '@mui/icons-material/Start';
import { useMutation } from "@apollo/client";
import uuid4 from "uuid4";
import { UPDATE_YC_LOGO_KEY } from "@/lib/gqlQueries/logoKey";
import { resizeLetterHead, resizeYcEventPoster } from "@/lib/utils/imgResizer";
import { UPDATE_LOGO, UPDATE_PROFILE_PICTURE, UPDATE_VESSEL_IMAGE, YC_EVENT, updateLogo } from "@/slices/actions/authActions";
import { makeNewRaceFieldAct } from "@/slices/actions/workingRaceActions";

const SetRaceImage = () => {
  const dispatch = useDispatch();
  const image = useSelector(state => state.workingRace.imageObj)
  const [editing, setEditing] = useState(true);
  const moreThan600px = useMediaQuery('(min-width:600px)');
  const {fileDatum, src, imgKey} = image;

  const handleChange = async (e) => {
    const {files} = e.target;    
    const file = files[0];
    const reader = new FileReader()
    reader.onload = (e) => {
      // this call back is where the image datum can be surfaced.
      let imageObject = {
        fileDatum: e.target.result,
        imgKey: uuid4(),
        src: URL.createObjectURL(file),
      }    
      dispatch(makeNewRaceFieldAct({imageObj: imageObject}))
    };
    reader.readAsDataURL(file);
  };

  const goToReview = () => {
    // this is where we sill upload the image to s3 and nav to review.
  }

  const resetImage = () => dispatch(makeNewRaceFieldAct({imageObj: { src: null, fileDatum: null, imgKey: null }}))

  const imgWidthAndHeight = moreThan600px ? '45%' : '100%';

  return (
    <>
      <Stack alignItems="center">
        {fileDatum &&
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
              src={fileDatum}
            />
            <Grid>
              <Fab
                onClick={resetImage}
                variant="extended"
                sx={{
                  background: 'white',
                  position: 'relative',
                  marginRight: 5,
                  top: -50,
                }}>
                  <EditIcon fontSize="small" />
                  &nbsp; edit img                
              </Fab>
              <Fab
                onClick={goToReview}
                variant="extended"
                sx={{
                  background: 'white',
                  position: 'relative',
                  marginRight: 5,
                  top: -50,
                }}>
                  next &nbsp;
                  <StartIcon />
              </Fab>
            </Grid>
          </>
        }        
        {!fileDatum &&
          <input
            onChange={(e) => handleChange(e)}
            type="file"
            id="fileUpload"
            accept="image/jpeg, image/png, image/jpg"
            style={{              
              width: '90%',
              maxWidth: 500,
            }}
          />
        }
      </Stack>
    </>
  )
}

export default SetRaceImage;