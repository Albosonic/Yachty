import { Button, TextField, Typography } from "@mui/material";
import EastIcon from '@mui/icons-material/East';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { EVENT_FIELDS, makeNewEventFieldAct } from "@/slices/actions/workingEventActions";

const SetEventLocation = ({ callback }) => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState({location: ''});
  const {ENTERTAINMENT} = EVENT_FIELDS
  const editLocation = () => {
    dispatch(makeNewEventFieldAct(location));
    callback(ENTERTAINMENT)
  }
  return (
    <>      
      <Typography variant="h4">Location</Typography>              
      <TextField
        multiline
        fullWidth
        label="event location"
        variant="standard"
        onChange={(e) => setLocation({location: e.target.value})}
        InputProps={{endAdornment: <Button onClick={editLocation} endIcon={<EastIcon />}>next</Button>}}
      />
    </>
  )
}

export default SetEventLocation;