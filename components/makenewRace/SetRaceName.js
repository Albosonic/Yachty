import { clearNewRaceFieldsAct, makeNewRaceFieldAct } from "@/slices/actions/workingRaceActions";
import { Button, Grid, TextField, Typography } from "@mui/material";
import EastIcon from '@mui/icons-material/East';
import { useDispatch } from "react-redux";
import { useState } from "react";
import { RACE_FIELDS } from "@/pages/yachty/make_new_race";

const SetRaceName = ({ callback }) => {
  const dispatch = useDispatch();
  const [raceName, setRaceName] = useState({raceName: ''});
  const {SERIES} = RACE_FIELDS
  const editRaceName = () => {
    dispatch(makeNewRaceFieldAct(raceName));
    callback(SERIES)
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
        InputProps={{endAdornment: <Button onClick={editRaceName} endIcon={<EastIcon />}>next</Button>}}
      />
    </>
  )
}

export default SetRaceName;