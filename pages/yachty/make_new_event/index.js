import NavBar from "@/components/NavBar";
import { Grid, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import RaceDetail from "@/components/makenewRace/RaceDetail";
import SetEventName from "@/components/makenewEvent/SetEventName";
import { EVENT_FIELDS, clearNewEventFieldsAct } from "@/slices/actions/workingEventActions";
import SetEventLocation from "@/components/makenewEvent/SetEventLocation";
import SetEventStart from "@/components/makenewEvent/SetEventStart";
import SetEventEnd from "@/components/makenewEvent/SetEventEnd";
import SetEventImage from "@/components/makenewEvent/SetEventImage";
import SetEventNotes from "@/components/makenewEvent/SetSpecialNotes";
import SetEventEntertainment from "@/components/makenewEvent/SetEntertainment";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const makeNewRace = () => {  
  const {
    EVENT_NAME,
    LOCATION,
    ENTERTAINMENT,
    START_DATE,
    END_DATE,
    IMAGE,
    SPECIAL_NOTES,
  } = EVENT_FIELDS;

  const name = useSelector(state => state.workingEvent.name)
  const location = useSelector(state => state.workingEvent.location)
  const entertainment = useSelector(state => state.workingEvent.entertainment)
  const startDate = useSelector(state => state.workingEvent.startDate)
  const endDate = useSelector(state => state.workingEvent.endDate)
  const specialNotes = useSelector(state => state.workingEvent.specialNotes)
  const image = useSelector(state => state.workingEvent.image)

  const flowOrder = [
    {EVENT_NAME: name},
    {LOCATION: location},
    {ENTERTAINMENT: entertainment},
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
  }, [name, location, startDate, endDate, entertainment, specialNotes])

  // dispatch(clearNewEventFieldsAct());
  // console.warn('debug clear race field on!!!')  
  let startDayString = dayjs(startDate).$d.toString()
  let endDayString = dayjs(endDate).$d.toString()
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
        {entertainment &&
          <RaceDetail
            clearField={{entertainment: ''}}
            detail={entertainment}
            label="entertainment"
          />
        }        
        {startDate &&
          <RaceDetail
            clearField={{startDate: ''}}
            detail={startDayString}
            label="Start Date"
          />
        }
        {endDate &&
          <RaceDetail
            clearField={{endDate: ''}}
            detail={endDayString}
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
          {currentField === ENTERTAINMENT && <SetEventEntertainment callback={setCurrentField} />}
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