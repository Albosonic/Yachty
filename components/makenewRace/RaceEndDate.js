import { clearNewRaceFieldsAct, makeNewRaceFieldAct } from "@/slices/actions/workingRaceActions";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { DateTimeField, MobileDateTimePicker } from "@mui/x-date-pickers";
import EastIcon from '@mui/icons-material/East';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import dayjs from "dayjs";
import { getIsoDate, getNormalCalanderDate } from "@/lib/utils/getters";
import { RACE_FIELDS } from "@/pages/yachty/make_new_race";

const SetRaceEnd = ({ callBack }) => {
  const dispatch = useDispatch();
  const [endDate, setEndDate] = useState(null);
  const workingDate = useSelector(state => state.scheduler.workingRaceDate)  
  const {RACE_NAME} = RACE_FIELDS;
  // dispatch(clearNewRaceFieldsAct()); for debugging...
  const editRaceEnd = () => {
    let dateString = endDate.toString()
    // let t = new Date(dateString)
    // let date = getNormalCalanderDate(t.toISOString())
    dispatch(makeNewRaceFieldAct({endDate: dateString}));
    callBack(RACE_NAME);
  }    

  return (
    <>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit>
        <Typography variant="h4">Race End</Typography>
      </Slide>
      <Grid sx={{minWidth: 300}} container justifyContent="space-between">
        <MobileDateTimePicker
          // defaultValue={defaultStartDate || dayjs(new Date())}
          onChange={(e) => setEndDate(e.$d)}        
        />
          <Slide direction="left" in={true} mountOnEnter unmountOnExit>
            <Button onClick={editRaceEnd} endIcon={<EastIcon />}>next</Button>        
          </Slide>

        
      </Grid>
    </>
  )
}

export default SetRaceEnd;