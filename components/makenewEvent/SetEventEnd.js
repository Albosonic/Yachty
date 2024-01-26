import { RACE_FIELDS, clearNewRaceFieldsAct, makeNewRaceFieldAct } from "@/slices/actions/workingRaceActions";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import EastIcon from '@mui/icons-material/East';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { EVENT_FIELDS, makeNewEventFieldAct } from "@/slices/actions/workingEventActions";
import dayjs from "dayjs";

const SetEventEnd = ({ callback }) => {
  const dispatch = useDispatch();
  const startDate = useSelector(state => state.workingEvent.startDate);
  const [error, setError] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const {SPECIAL_NOTES} = EVENT_FIELDS;
  // dispatch(clearNewRaceFieldsAct()); for debugging...
  const editEventEnd = () => {
    const compareStart = new Date(startDate).getTime();
    const compareEnd = new Date(endDate).getTime();
    if (compareStart > compareEnd) return setError(true);
    dispatch(makeNewEventFieldAct({endDate: endDate}));
    callback(SPECIAL_NOTES);
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
            onChange={(e) => setEndDate(e)}
          />
          {error && <Typography color="error">cannot have end date before start date</Typography>}
        </Stack>
          <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Button onClick={editEventEnd} endIcon={<EastIcon />}>next</Button>
          </Slide>
      </Grid>
    </>
  )
}

export default SetEventEnd;