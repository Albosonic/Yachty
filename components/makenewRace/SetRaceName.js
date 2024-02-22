import { RACE_FIELDS, clearNewRaceFieldsAct, makeNewRaceFieldAct } from "@/slices/actions/workingRaceActions";
import { Button, Grid, TextField, Typography } from "@mui/material";
import EastIcon from '@mui/icons-material/East';
import { useDispatch } from "react-redux";
import { useState } from "react";

const SetRaceName = () => {
  const dispatch = useDispatch();
  const [raceName, setRaceName] = useState({raceName: ''});
    
  const editRaceName = () => {
    dispatch(makeNewRaceFieldAct(raceName));    
  }

  return (
    <>      
      <Typography variant="h4">Race Name</Typography>              
      <TextField
        multiline
        fullWidth
        label="race name"
        variant="standard"
        onChange={(e) => setRaceName({raceName: e.target.value})}
        InputProps={{endAdornment: <Button disabled={raceName.raceName === ''} onClick={editRaceName} endIcon={<EastIcon />}>next</Button>}}
      />
    </>
  )
}

export default SetRaceName;