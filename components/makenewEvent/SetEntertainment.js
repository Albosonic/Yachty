import { Button, TextField, Typography } from "@mui/material";
import EastIcon from '@mui/icons-material/East';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { EVENT_FIELDS, makeNewEventFieldAct } from "@/slices/actions/workingEventActions";

const SetEventEntertainment = ({ callback }) => {
  const dispatch = useDispatch();
  const [entertainment, setEntertainment] = useState({entertainment: ''});
  const {START_DATE} = EVENT_FIELDS
  const editEventEntertainment = () => {
    dispatch(makeNewEventFieldAct(entertainment));
    callback(START_DATE)
  }
  return (
    <>
      <Typography variant="h4">Entertainment</Typography>
      <TextField
        multiline
        fullWidth
        label="entertainment"
        variant="standard"
        onChange={(e) => setEntertainment({entertainment: e.target.value})}
        InputProps={{endAdornment: <Button onClick={editEventEntertainment} endIcon={<EastIcon />}>next</Button>}}
      />
    </>
  )
}

export default SetEventEntertainment;