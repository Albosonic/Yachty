import { Button, Grid, Typography } from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import EastIcon from '@mui/icons-material/East';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { EVENT_FIELDS, makeNewEventFieldAct } from "@/slices/actions/workingEventActions";

const SetEventStart = ({ callback }) => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(null);
  const workingDateFromScheduler = useSelector(state => state.scheduler.workingEventDate);

  const {END_DATE} = EVENT_FIELDS;

  const editEventStart = () => {    
    dispatch(makeNewEventFieldAct({startDate: startDate}));
    callback(END_DATE);
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
          <Button onClick={editEventStart} endIcon={<EastIcon />}>next</Button>
        </Slide>
      </Grid>
    </>
  )
}

export default SetEventStart;