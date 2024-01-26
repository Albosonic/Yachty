import { RACE_FIELDS, clearNewRaceFieldsAct, makeNewRaceFieldAct } from "@/slices/actions/workingRaceActions";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import EastIcon from '@mui/icons-material/East';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import dayjs from "dayjs";

const SetRaceEnd = ({ callback }) => {
  const dispatch = useDispatch();
  const startDate = useSelector(state => state.workingRace.startDate);
  const [error, setError] = useState(false);
  const [endDate, setEndDate] = useState(null);    
  const {IMAGE} = RACE_FIELDS;
  // dispatch(clearNewRaceFieldsAct()); for debugging...
  const editRaceEnd = () => {
    const compareStart = new Date(startDate).getTime();
    const compareEnd = new Date(endDate).getTime();
    if (compareStart > compareEnd) return setError(true);
    let dateString = endDate.toString()
    dispatch(makeNewRaceFieldAct({endDate: dateString}));
    callback(IMAGE);
  }    

  return (
    <>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        <Typography variant="h4">Race End</Typography>
      </Slide>
      <Grid sx={{minWidth: 300}} container justifyContent="space-between">
        <Stack>
          <MobileDateTimePicker
            defaultValue={dayjs(startDate)}
            onChange={(e) => setEndDate(e.$d)} 
          />
          {error && <Typography color="error">cannot have end date before start date</Typography>}
        </Stack>
          <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Button onClick={editRaceEnd} endIcon={<EastIcon />}>next</Button>        
          </Slide>
      </Grid>
    </>
  )
}

export default SetRaceEnd;