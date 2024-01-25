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
import dayjs from "dayjs";

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
  const existingImg = useSelector(state => state.workingRace.existingImg);

  const flowOrder = [
    {SERIES: series},
    {COURSE: course},
    {RACE_NAME: raceName},
    {START_DATE: startDate},
    {END_DATE: endDate},
    {RELEASE: release},
    {IMAGE: imageObj || existingImg},    
  ];

  const [currentField, setCurrentField] = useState('');

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
    if (!keyFound) {
      setCurrentField(IMAGE)
    }
  }, [series, course, raceName, startDate, endDate, release, imageObj])

  let startDayString = dayjs(startDate).$d.toString()
  let endDayString = dayjs(endDate).$d.toString()

  // dispatch(clearNewRaceFieldsAct());
  // console.warn('debug clear race field on!!!')

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
            label="Course"
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
            detail={startDayString}
            label="Starts"
          />
        }
        {endDate &&
          <RaceDetail
            clearField={{endDate: null}}
            detail={endDayString}
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