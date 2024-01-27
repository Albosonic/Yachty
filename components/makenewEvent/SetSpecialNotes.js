import { Button, TextField, Typography } from "@mui/material";
import EastIcon from '@mui/icons-material/East';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { EVENT_FIELDS, makeNewEventFieldAct } from "@/slices/actions/workingEventActions";

const SetEventNotes = ({ callback }) => {
  const dispatch = useDispatch();
  const [specialNotes, setEventNotes] = useState({specialNotes: ''});
  const {IMAGE} = EVENT_FIELDS
  const editEventName = () => {    
    dispatch(makeNewEventFieldAct(specialNotes));    
    callback(IMAGE)
  }
  return (
    <>      
      <Typography variant="h4">Special Notes</Typography>              
      <TextField
        multiline
        fullWidth
        label="special notes"
        variant="standard"
        onChange={(e) => setEventNotes({specialNotes: e.target.value})}
        InputProps={{endAdornment: <Button disabled= {specialNotes.specialNotes === ''} onClick={editEventName} endIcon={<EastIcon />}>next</Button>}}
      />
    </>
  )
}

export default SetEventNotes;