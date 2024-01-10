import { RACE_FIELDS, clearNewRaceFieldsAct, makeNewRaceFieldAct } from "@/slices/actions/workingRaceActions";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { DateTimeField, MobileDateTimePicker } from "@mui/x-date-pickers";
import EastIcon from '@mui/icons-material/East';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const SetRaceStart = ({ callback }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const workingDateFromScheduler = useSelector(state => state.scheduler.workingRaceDate)
  const {END_DATE} = RACE_FIELDS;
  // dispatch(clearNewRaceFieldsAct()); for debugging...
  const editRaceStart = () => {
    let dateString = startDate.toString()
    dispatch(makeNewRaceFieldAct({startDate: dateString}));
    callback(END_DATE);
  }

  const defaultStartDate = workingDateFromScheduler ? dayjs(workingDateFromScheduler?.start.value) : null;
  useEffect(() => {
    const date = defaultStartDate;
    console.log('date ====', date)
    setStartDate(defaultStartDate.$d)
  }, [defaultStartDate])

  return (
    <>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        <Typography variant="h4">Start Date</Typography>
      </Slide>
      <Grid sx={{minWidth: 300}} container justifyContent="space-between">
        <MobileDateTimePicker
          defaultValue={defaultStartDate || dayjs(new Date())}
          onChange={(e) => setStartDate(e.$d)}
        />
        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
          <Button onClick={editRaceStart} endIcon={<EastIcon />}>next</Button>
        </Slide>
      </Grid>
    </>
  )
}

export default SetRaceStart;