import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import NavBar from "@/components/NavBar";
import { GET_RACE_BY_ID } from "@/lib/gqlQueries/racinggql";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Fab, FormControlLabel, Grid, Stack, Typography } from "@mui/material";
import LoadingYachty from "@/components/LoadingYachty";
import SetRaceCourse from "@/components/makenewRace/SetRaceCourse";
import { getCountDown } from "@/lib/utils/getters";
import Checkbox from '@mui/material/Checkbox';


const CourseCountDown = ({ startDate, startTime, course, raceStartedCb }) => {
  const [countDown, setCountDown] = useState(null)  
  const [showCourse, setShowCourse] = useState(false)  
  useEffect(() => {
    // if (!startDate || !startTime) return setCountDown(<LoadingYachty isRoot={false} />)
    const {diff, seconds, minutes, hours, days } = getCountDown(startDate, startTime)
    if (minutes < 5) {
      raceStartedCb(true)
      setShowCourse(true)
    }
    setInterval(() => {
      if (minutes < 5) {
        
        raceStartedCb(true)
        setShowCourse(true)
      }
      if (days > .9) {
        const daysArr = days.split('.')
        const calculatedHours = (24 / daysArr[1]).toString().split('.')[0]        
        return setCountDown(<Typography variant="h5">{`Starts in ${days[0]} days ${calculatedHours} hrs`}</Typography>)
      } else if (hours > 0 && hours < 25) {
        const hrsArr = hours.split('.')
        const calculatedMinutes = hrsArr[1] * 6
        return setCountDown(<Typography variant="h5">{`Starts in ${hrsArr[0]} hrs ${calculatedMinutes} minutes`}</Typography>)
      } else if (minutes > 0 && minutes < 61) {
        const minutesArr = minutes.split('.')
        const calculatedSeconds = minutesArr[1] * 6
        setCountDown(<Typography variant="h5">{`Starts in ${minutes[0]} mintutes ${calculatedSeconds} seconds`}</Typography>)
      } else if (seconds > 0 && seconds < 61) {
        return setCountDown(<Typography variant="h3">{`Get ${seconds} Ready!`}</Typography>)
      }
    }, 1000)
  }, [startTime, startDate])
  if (!course) return  
  const {instructions, courseName} = course
  return (
    <Stack spacing={2} sx={{minWidth: 300, paddingTop: 5}}>
      {countDown}
      {showCourse && <Typography sx={{paddingBottom: 1}} variant="h4">{ courseName }</Typography>}
      {showCourse && 
        instructions.map((leg, i) => {
          return (
            <Grid container justifyContent="space-between">
              <Typography sx={{lineHeight: 3.5}}  variant="body1">{`${i + 1}. ${leg.marker} ${leg.side}`}</Typography>
              <FormControlLabel control={<Checkbox />} />
            </Grid>
          )
        })
      }
    </Stack>
  )  
}

const Race = () => {
  const router = useRouter();
  const raceId = router.query.raceId;
  const [race, setRace] = useState({raceName: '', startDate: '', startTime: ''})  
  const [raceStarted, setRaceStarted] = useState(false)
  const {error, loading, data} = useQuery(GET_RACE_BY_ID, {variables: {raceId}});
  const {raceName, startDate, startTime} = race
  useEffect(() => {
    if (loading) return
    setRace(data.races[0])
  }, [data])

  const goBack = () => {
    router.back()
  }

  if (loading) return <LoadingYachty />;  

  return (
    <>
      <NavBar />
      <Fab size="medium" onClick={goBack} variant="extended" sx={{ margin: 3, alignSelf: 'flex-start' }} color="primary">
        <ArrowBackIcon /> Back
      </Fab>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h4">{ raceName } Race</Typography>
        <CourseCountDown 
          startDate={startDate} 
          startTime={startTime}
          course={race.race_course}
          raceStartedCb={setRaceStarted}
        />
        {/* TODO: figure our this no callback with set race */}
        {/* {!raceStarted && <SetRaceCourse />} */}
        <Button size="small" fullWidth sx={{padding: 2, borderRadius: 0, bottom: 0, position: 'absolute'}} variant="outlined">
          Start Race
        </Button>
      </Stack>
    </>
  )
}

export default Race;
