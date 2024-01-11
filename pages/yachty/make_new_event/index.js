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
import SetEventName from "@/components/makenewEvent/SetEventName";
import { EVENT_FIELDS, clearNewEventFieldsAct } from "@/slices/actions/workingEventActions";
import SetEventLocation from "@/components/makenewEvent/SetEventLocation";
import SetEventStart from "@/components/makenewEvent/SetEventStart";
import SetEventEnd from "@/components/makenewEvent/SetEventEnd";
import SetEventImage from "@/components/makenewEvent/SetEventImage";
import SetEventNotes from "@/components/makenewEvent/SetSpecialNotes";

const makeNewRace = () => {
  const dispatch = useDispatch()
  const {
    EVENT_NAME,
    LOCATION,
    START_DATE,
    END_DATE,
    IMAGE,
    SPECIAL_NOTES,
  } = EVENT_FIELDS;

  const name = useSelector(state => state.workingEvent.name)
  const location = useSelector(state => state.workingEvent.location)
  const startDate = useSelector(state => state.workingEvent.startDate)
  const endDate = useSelector(state => state.workingEvent.endDate)
  const specialNotes = useSelector(state => state.workingEvent.specialNotes)
  const image = useSelector(state => state.workingEvent.image)

  const flowOrder = [
    {EVENT_NAME: name},
    {LOCATION: location},
    {START_DATE: startDate},
    {END_DATE: endDate},
    {SPECIAL_NOTES: specialNotes},
    {IMAGE: image}
  ];

  const [currentField, setCurrentField] = useState('')

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
  }, [name, location, startDate, endDate])

//   const {fullDay: startDay, time: startTime} = getNormalDateFromDaysjsString(startDate);
//   const {fullDay: endDay, time: endTime} = getNormalDateFromDaysjsString(endDate);

//   const fullStart = `${startDay} ${startTime}`;
//   const fullStop = `${endDay} ${endTime}`;

  // dispatch(clearNewEventFieldsAct());
  // console.warn('debug clear race field on!!!')
  console.log('current =======', currentField)
  return (
    <>
      <NavBar />
      <Grid
        container
        direction="column"
        alignItems="center"
        padding={5}
      >
        {name &&
          <RaceDetail
            clearField={{name: ''}}
            detail={name}
            label="Event Name"
          />
        }
        {location &&
          <RaceDetail
            clearField={{location: ''}}
            detail={location}
            label="Location"
          />
        }
        {startDate &&
          <RaceDetail
            clearField={{startDate: ''}}
            detail={startDate}
            label="Start Date"
          />
        }
        {endDate &&
          <RaceDetail
            clearField={{endDate: ''}}
            detail={startDate}
            label="Start Date"
          />
        }
        {specialNotes &&
          <RaceDetail
            clearField={{specialNotes: ''}}
            detail={specialNotes}
            label="Special Notes"
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
          {currentField === EVENT_NAME && <SetEventName callback={setCurrentField} />}
          {currentField === LOCATION && <SetEventLocation callback={setCurrentField} />}
          {currentField === START_DATE && <SetEventStart callback={setCurrentField} />}
          {currentField === END_DATE && <SetEventEnd callback={setCurrentField} />}
          {currentField === SPECIAL_NOTES && <SetEventNotes callback={setCurrentField} />}
          {currentField === IMAGE && <SetEventImage callback={setCurrentField} />}
        </Stack>
      </Grid>
    </>

  )
}

export default makeNewRace;