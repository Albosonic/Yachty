import { clearNewEventFieldsAct, makeNewEventFieldAct } from "@/slices/actions/workingEventActions";
import { clearNewRaceFieldsAct, makeNewRaceFieldAct } from "@/slices/actions/workingRaceActions";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { useDispatch } from "react-redux";

const EventDetail = ({ detail, label, clearField }) => {
  const dispatch = useDispatch();
  return (
    <Stack width="100%" margin={1}>
      <Typography variant="h5">{label}</Typography>
      <Grid container>
      <Typography variant="h6">{detail}</Typography>
        <Button onClick={() => dispatch(makeNewEventFieldAct(clearField))}>edit</Button>
      </Grid>
    </Stack>
  )
}

export default EventDetail;