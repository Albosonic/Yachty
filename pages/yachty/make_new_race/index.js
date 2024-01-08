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
import { RACE_FIELDS, clearNewRaceFieldsAct } from "@/slices/actions/workingRaceActions";
import SetRaceCourse from "@/components/makenewRace/SetRaceCourse";
import { INSERT_RACE_ONE } from "@/lib/gqlQueries/racinggql";
import { useMutation } from "@apollo/client";
import SetRaceRelease from "@/components/makenewRace/SetRaceRelease";
import SetRaceImage from "@/components/makenewRace/SetRaceImage";

const makeNewRace = () => {
  const dispatch = useDispatch()
  const {
    SERIES,
    COURSE,
    RACE_NAME,
    START_DATE,
    END_DATE,
    RELEASE,
    IMAGE,
  } = RACE_FIELDS;

  const series = useSelector(state => state.workingRace.series);
  const course = useSelector(state => state.workingRace.course);
  const raceName = useSelector(state => state.workingRace.raceName);
  const startDate = useSelector(state => state.workingRace.startDate);
  const endDate = useSelector(state => state.workingRace.endDate);
  const release = useSelector(state => state.workingRace.release);
  const imageObj = useSelector(state => state.workingRace.image);

  const flowOrder = [
    {SERIES: series},
    {COURSE: course},
    {RACE_NAME: raceName},
    {START_DATE: startDate},
    {END_DATE: endDate},
    {RELEASE: release},
    {IMAGE: imageObj}
  ];

  const [currentField, setCurrentField] = useState('');
  const [insertRace, {loading: insertRaceLoading}] = useMutation(INSERT_RACE_ONE);

  useEffect(() => {
    let keyFound = false;
    flowOrder.forEach(detail => {
      let key = Object.keys(detail)[0];
      if (keyFound) return;
      if (!detail[key]) {
        keyFound = true;
        setCurrentField(key);
      }
    })
  }, [series, course, raceName, startDate, endDate, release, imageObj])

  const {fullDay: startDay, time: startTime} = getNormalDateFromDaysjsString(startDate);
  const {fullDay: endDay, time: endTime} = getNormalDateFromDaysjsString(endDate);

  const fullStart = `${startDay} ${startTime}`;
  const fullStop = `${endDay} ${endTime}`;

  // dispatch(clearNewRaceFieldsAct());
  // console.warn('debug clear race field on!!!')

  console.log('currenField ====', currentField)

  return (
    <>
      <NavBar />
      <Grid
        container
        direction="column"
        alignItems="center"
        padding={5}
      >
        {series &&
          <RaceDetail
            clearField={{series: null}}
            detail={series.seriesName}
            label="Race Series"
          />
        }
        {course &&
          <RaceDetail
            clearField={{course: null}}
            detail={course.courseName}
            label="course"
          />
        }
        {raceName && 
          <RaceDetail
            clearField={{raceName: ''}}
            detail={raceName} 
            label="Race name"
          />
        }        
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
        {release &&
          <RaceDetail
            clearField={{release: null}}
            detail={release.name}
            label="Release"
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
          {currentField === SERIES && <SetRaceSeries callback={setCurrentField} />}
          {currentField === COURSE && <SetRaceCourse callback={setCurrentField} />}
          {currentField === RACE_NAME && <SetRaceName callback={setCurrentField} />}
          {currentField === START_DATE && <SetRaceStart callback={setCurrentField} />}
          {currentField === END_DATE && <SetRaceEnd callback={setCurrentField} />}
          {currentField === RELEASE && <SetRaceRelease callback={setCurrentField} />}
          {currentField === IMAGE && <SetRaceImage />}
        </Stack>
      </Grid>
    </>

  )
}

export default makeNewRace;