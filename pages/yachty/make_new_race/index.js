import NavBar from "@/components/NavBar";
import SetRaceStart from "@/components/makenewRace/RaceStartDate";
import { Grid, Stack, Typography } from "@mui/material";
import SetRaceName from "@/components/makenewRace/SetRaceName";
import { useSelector } from "react-redux";
import { useState } from "react";
import SetRaceEnd from "@/components/makenewRace/RaceEndDate";
import { getNormalDateFromDaysjsString } from "@/lib/utils/getters";

export const RACE_FIELDS = {
  START_DATE: 'START_DATE',
  MULTI_DATE: 'MULTI_DATE',
  END_DATE: 'END_DATE',
  RACE_NAME: 'RACE_NAME',
  SERIES: 'SERIES',
  IMAGE: 'IMAGE',
  COURSE: 'COURSE',
}

const makeNewRace = () => {
  const {
    START_DATE,
    MULTI_DATE,
    END_DATE,    
    RACE_NAME,
    SERIES,
    IMAGE,
    COURSE
  } = RACE_FIELDS;
  const raceName = useSelector(state => state.workingRace.raceName);
  const startDate = useSelector(state => state.workingRace.startDate);

  const [currentField, setCurrentField] = useState(START_DATE);

  const {fullDay, time} = getNormalDateFromDaysjsString(startDate);
  

  return (
    <>
      <NavBar />
      <Grid
        container
        direction="column"
        alignItems="center"
        padding={5}
      >
        <Typography variant="h5">{`${fullDay} ${time}`}</Typography>
        
        <Typography variant="h5">{raceName}</Typography>

      </Grid>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '70vh' }}
      >
        <Stack spacing={2}>        
          {currentField === START_DATE && <SetRaceStart callBack={setCurrentField} />}
          {currentField === END_DATE && <SetRaceEnd callBack={setCurrentField} />}
          {currentField === RACE_NAME && <SetRaceName callBack={setCurrentField} />}
        </Stack>
      </Grid>
    </>

  )
}

export default makeNewRace;