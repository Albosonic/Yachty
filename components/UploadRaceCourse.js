import { useState } from "react";
import { Button, FormControl, FormControlLabel, Grid, IconButton, List, ListItemButton, ListItem, Paper, Radio, RadioGroup, Stack, TextField, Typography, Fab, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ListItemText from '@mui/material/ListItemText';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


const UploadRaceCourse = () => {
  // const clearWorkingLeg = {marker: null, side: null}
  const [userInput, setUserInput] = useState('');
  const [workingLeg, setWorkingLeg] = useState({marker: null, side: null});
  const [course, setCourse] = useState([]);
  const moreThan600px = useMediaQuery('(min-width:600px)');

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

  const { marker, side } = workingLeg;
  const containerWidth =  moreThan600px ? 700 : 350;
  return (
    <>
      <Stack width="100%" maxWidth={containerWidth} spacing={3} alignContent="center">        
        <Fab sx={{maxWidth: 150, alignSelf: 'flex-end'}} onClick={console.log('upload course')} color="success" variant="extended">
          <AddIcon />
          upload
        </Fab>
        <List>
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
        {(marker || side) && <Paper elevation={4} sx={{padding: 2}}>
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