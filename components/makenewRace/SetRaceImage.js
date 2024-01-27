import { useDispatch, useSelector } from "react-redux";
import { Box, Fab, Grid, Stack, useMediaQuery } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import StartIcon from '@mui/icons-material/Start';
import uuid4 from "uuid4";
import { clearWorkingRaceImagesAct, makeNewRaceFieldAct, toggleRaceInReviewAct } from "@/slices/actions/workingRaceActions";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SetRaceImage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [showInput, setShowInput] = useState(true);  
  const image = useSelector(state => state.workingRace.image)
  const existingImg = useSelector(state => state.workingRace.existingImg)
  const existingRace = useSelector(state => state.workingRace.existingRace)
  const moreThan600px = useMediaQuery('(min-width:600px)');
  const {fileDatum} = image;

  useEffect(() => {
    if (fileDatum || existingImg) {
      setShowInput(false)
    } else {
      setShowInput(true)
    }
  }, [image, existingImg])

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
      dispatch(makeNewRaceFieldAct({image: imageObject}))      
    };
    reader.readAsDataURL(file);
  };

  const goToReview = () => {    
    dispatch(toggleRaceInReviewAct(true))
    router.push({ pathname: '/yachty/make_new_race/review' })
  }

  const resetImage = () => dispatch(clearWorkingRaceImagesAct())  

  const imgWidthAndHeight = moreThan600px ? '45%' : '100%';

  return (
    <>
      <Stack alignItems="center">
        {!showInput &&
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
              src={fileDatum || existingImg}
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
        {showInput &&
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