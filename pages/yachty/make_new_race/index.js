import NavBar from "@/components/NavBar";
import SetRaceStart from "@/components/makenewRace/RaceStartDate";
import { Button, Grid, Stack, Typography } from "@mui/material";
import SetRaceName from "@/components/makenewRace/SetRaceName";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import SetRaceEnd from "@/components/makenewRace/RaceEndDate";
import { getNormalDateFromDaysjsString } from "@/lib/utils/getters";
import RaceDetail from "@/components/makenewRace/RaceDetail";
import SetRaceSeries from "@/components/makenewRace/RaceSeriesl";
import { clearNewRaceFieldsAct } from "@/slices/actions/workingRaceActions";

export const RACE_FIELDS = {
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',
  RACE_NAME: 'RACE_NAME',
  SERIES: 'SERIES',
  IMAGE: 'IMAGE',
  COURSE: 'COURSE',
}



const makeNewRace = () => {
  // const dispatch = useDispatch()
  const {
    START_DATE,
    END_DATE,
    RACE_NAME,
    SERIES,
    IMAGE,
    COURSE
  } = RACE_FIELDS;

  const raceName = useSelector(state => state.workingRace.raceName);
  const startDate = useSelector(state => state.workingRace.startDate);
  const endDate = useSelector(state => state.workingRace.endDate);
  const series = useSelector(state => state.workingRace.series);

  const flowOrder = [{START_DATE: startDate}, {END_DATE: endDate}, {RACE_NAME: raceName}, {SERIES: series}];

  const [currentField, setCurrentField] = useState(START_DATE);

  useEffect(() => {
    flowOrder.forEach(detail => {
      let key = Object.keys(detail)[0];
      if (!detail[key]) {
        setCurrentField(key);
      }
    })
  }, [raceName, startDate, endDate, series])

  const {fullDay: startDay, time: startTime} = getNormalDateFromDaysjsString(startDate);
  const {fullDay: endDay, time: endTime} = getNormalDateFromDaysjsString(endDate);

  const fullStart = `${startDay} ${startTime}`;
  const fullStop = `${endDay} ${endTime}`;
  // dispatch(clearNewRaceFieldsAct());

  return (
    <>
      <NavBar />
      <Grid
        container
        direction="column"
        alignItems="center"
        padding={5}
      >
        {startDate && 
          <RaceDetail 
            clearField={{startDate: null}}
            detail={fullStart} 
            label="Starts"
          />
        }
        {endDate && 
          <RaceDetail
            clearField={{endDate: null}}
            detail={fullStop} 
            label="Ends"
          />
        }
        {raceName && 
          <RaceDetail
            clearField={{raceName: ''}}
            detail={raceName} 
            label="Race name"
          />
        }
        {series && 
          <RaceDetail 
            clearField={{series: null}}
            detail={series.seriesName} 
            label="Race Series"
          />
        }
      </Grid>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '50vh' }}
      >
        <Stack spacing={2}>
          {currentField === START_DATE && <SetRaceStart callback={setCurrentField} />}
          {currentField === END_DATE && <SetRaceEnd callback={setCurrentField} />}
          {currentField === RACE_NAME && <SetRaceName callback={setCurrentField} />}
          {currentField === SERIES && <SetRaceSeries callback={setCurrentField} />}          
        </Stack>
      </Grid>
    </>

  )
}

export default makeNewRace;