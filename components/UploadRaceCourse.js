import { useState } from "react";
import { Button, FormControl, FormControlLabel, Grid, IconButton, List, ListItemButton, ListItem, Paper, Radio, RadioGroup, Stack, TextField, Typography, Fab, useMediaQuery, FormLabel, Snackbar, Alert } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ListItemText from '@mui/material/ListItemText';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation } from "@apollo/client";
import { INSERT_RACE_COURSE } from "@/lib/gqlQueries/racinggql";
import { useSelector } from "react-redux";


const UploadRaceCourse = () => {
  const clearCourseInfo = {name: '', set: false, startFrom: ''};
  const [userInput, setUserInput] = useState('');
  const [courseNameInfo, setCourseNameInfo] = useState(clearCourseInfo);
  const [workingLeg, setWorkingLeg] = useState({marker: null, side: null});
  const [course, setCourse] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const moreThan600px = useMediaQuery('(min-width:600px)');
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [insertRaceCourse, {loading: courseLoading}] = useMutation(INSERT_RACE_COURSE);
  const { name: courseTitle, set: titleSet, startFrom } = courseNameInfo;

  const addCourseLeg = () => {
    setCourse([...course, workingLeg]);
    setWorkingLeg({...workingLeg, marker: null});
    setUserInput('');
  };

  const deleteCourseLeg = (index) => {
    if (index > -1) {
      course.splice(index, 1);
      setCourse([...course]);
    }
  };

  const uploadRaceCourse = async () => {
    await insertRaceCourse({variables: { courseName: courseTitle, ycId: ycId, instructions: course }});
    setShowSuccess(true);
  }

  const handleClose = () => {
    setCourseNameInfo({...clearCourseInfo})
    setCourse([]);
    setShowSuccess(false);
  }

  const { marker, side } = workingLeg;
  const containerWidth = moreThan600px ? 700 : 350;
  const uploadButtonLocation = moreThan600px ? '30%' : '10%';
  return (
    <>
      <Stack sx={{
          overflow: "hidden",
          overflowY: "scroll",
          height: 600,
        }}
        width="100%"
        maxWidth={containerWidth}
        spacing={3}
        alignContent="center"
      >
        <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Success
          </Alert>
        </Snackbar>
        <Fab
          size="small"
          sx={{
            alignSelf: 'flex-end',
            position: 'fixed',
            right: uploadButtonLocation,
            top: 140
          }}
          onClick={uploadRaceCourse}
          color="success"
          variant="extended"
        >
          <AddIcon />
          upload
        </Fab>
        {!titleSet &&
        <TextField
          placeholder="Enter course name"
          multiline
          onChange={(e) => setCourseNameInfo({...courseNameInfo, name: e.target.value})}
          value={courseTitle}
          variant="standard"
          sx={{width: '100%'}}
          InputProps={{endAdornment: <Button onClick={() => setCourseNameInfo({...courseNameInfo, set: true})}>Set</Button>}}
        />}
        <List>
          {titleSet &&
          <>
            <ListItem
              sx={{width: '100%', display: 'flex', justifyContent: 'center'}}
              secondaryAction={
                <IconButton onClick={() => setCourseNameInfo({name: '', set: false})} edge="end" aria-label="course-title">
                  <DeleteForeverIcon/>
                </IconButton>
              }
                disablePadding
              >
              <ListItemText primaryTypographyProps={{variant: 'h4'}} id={courseTitle} primary={courseTitle} />
            </ListItem>
            {startFrom && <Typography> start from: { startFrom}</Typography>}
            <FormControl sx={{width: '100%'}}>
              <FormLabel id="demo-form-control-label-placement">Choose Start Direction</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                sx={{justifyContent: 'space-around'}}
                onChange={(e) => setCourseNameInfo({ ...courseNameInfo, startFrom: e.target.value })}
              >
                <FormControlLabel labelPlacement="start" value="West" control={<Radio />} label="West" />
                <Stack>
                  <FormControlLabel labelPlacement="top" value="North" control={<Radio />} label="North" />
                  <FormControlLabel labelPlacement="bottom" value="South" control={<Radio />} label="South" />
                </Stack>
                <FormControlLabel value="East" control={<Radio />} label="East" />
              </RadioGroup>
            </FormControl>
          </>}

          {course.map((leg, index) => {
            const {marker, side} = leg;
            return (
              <ListItem
                key={marker + side + index}
                secondaryAction={
                  <IconButton onClick={() => deleteCourseLeg(index)} edge="end" aria-label="comments">
                    <DeleteForeverIcon/>
                  </IconButton>
                }
                  disablePadding
                >
                <ListItemText id={index} primary={`${ index + 1 }. ${ marker } To ${ side } `} />
              </ListItem>
            )
          })}
        </List>
        {(marker || side) &&
        <Paper elevation={4} sx={{padding: 2}}>
          <Grid container flexWrap="nowrap" justifyContent="space-around">
            {marker && <Typography>Marker: {marker}</Typography>}
            {side && <Typography> To: {side}</Typography>}
          </Grid>
        </Paper>}
        <TextField
          placeholder="enter marker/bouy"
          multiline
          onChange={(e) => setUserInput(e.target.value)}
          value={userInput}
          variant="standard"
          sx={{width: '100%'}}
          InputProps={{endAdornment: <Button onClick={() => setWorkingLeg({...workingLeg, marker: userInput})}>Set</Button>}}
        />
        <FormControl sx={{width: '100%'}}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            sx={{justifyContent: 'space-around'}}
            onChange={(e) => setWorkingLeg({ ...workingLeg, side: e.target.value })}
          >
            <FormControlLabel labelPlacement="start" value="Port" control={<Radio />} label="To Port" />
            <FormControlLabel value="Starboard" control={<Radio />} label="To Starboard" />
          </RadioGroup>
        </FormControl>
        <Button onClick={addCourseLeg}>
          Add Course Leg
        </Button>
      </Stack>
    </>
  )
};

export default UploadRaceCourse;