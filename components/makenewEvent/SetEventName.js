import { Button, TextField, Typography } from "@mui/material";
import EastIcon from '@mui/icons-material/East';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { EVENT_FIELDS, makeNewEventFieldAct } from "@/slices/actions/workingEventActions";

const SetEventName = ({ callback }) => {
  const dispatch = useDispatch();
  const [name, setEventName] = useState({name: ''});
  const {LOCATION} = EVENT_FIELDS
  const editEventName = () => {    
    dispatch(makeNewEventFieldAct(name));    
    callback(LOCATION)
  }
  return (
    <>      
      <Typography variant="h4">Event Name</Typography>              
      <TextField
        multiline
        fullWidth
        label="event name"
        variant="standard"
        onChange={(e) => setEventName({name: e.target.value})}
        InputProps={{endAdornment: <Button onClick={editEventName} endIcon={<EastIcon />}>next</Button>}}
      />
    </>
  )
}

export default SetEventName;