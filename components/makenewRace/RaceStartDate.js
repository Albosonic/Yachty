import { makeNewRaceFieldAct } from "@/slices/actions/workingRaceActions";
import { Button, Grid, Typography } from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import EastIcon from '@mui/icons-material/East';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const SetRaceStart = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const workingDateFromScheduler = useSelector(state => state.scheduler.workingRaceDate)  
  // dispatch(clearNewRaceFieldsAct()); for debugging...
  const editRaceStart = () => {    
    dispatch(makeNewRaceFieldAct({startDate: startDate}));    
  }

  const defaultStartDate = workingDateFromScheduler ? dayjs(workingDateFromScheduler) : dayjs(new Date());
  
  useEffect(() => {  
    setStartDate(defaultStartDate)
  }, [workingDateFromScheduler])

  return (
    <>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        <Typography variant="h4">Start Date</Typography>
      </Slide>
      <Grid sx={{minWidth: 300}} container justifyContent="space-between">
        <MobileDateTimePicker
          defaultValue={defaultStartDate}
          onChange={(e) => setStartDate(e)}
        />
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <Button onClick={editRaceStart} endIcon={<EastIcon />}>next</Button>
        </Slide>
      </Grid>
    </>
  )
}

export default SetRaceStart;