import { useDispatch, useSelector } from "react-redux";
import { Box, Fab, Grid, Stack, useMediaQuery } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import StartIcon from '@mui/icons-material/Start';
import uuid4 from "uuid4";
import { useRouter } from "next/router";
import { makeNewEventFieldAct } from "@/slices/actions/workingEventActions";

const SetEventImage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const image = useSelector(state => state.workingEvent.image)
  const moreThan600px = useMediaQuery('(min-width:600px)');
  const {fileDatum} = image;

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
      dispatch(makeNewEventFieldAct({image: imageObject}))
    };
    reader.readAsDataURL(file);
  };

  const goToReview = () => router.push({ pathname: '/yachty/make_new_event/review' });

  const resetImage = () => dispatch(makeNewEventFieldAct({image: { src: null, fileDatum: null, imgKey: null }}))

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

export default SetEventImage;