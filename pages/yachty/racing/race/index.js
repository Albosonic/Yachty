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
import { useSelector } from "react-redux";
// TODO: move cown into it's own file.
const CourseCountDown = ({ startDate, startTime, course, raceStartedCb }) => {
  const [countDown, setCountDown] = useState(null)
  const [showCourse, setShowCourse] = useState(false)

  useEffect(() => {
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
  const userIsCommodore = useSelector(state => state?.auth?.user?.userIsCommodore);
  const {error, loading, data, refetch} = useQuery(GET_RACE_BY_ID, {variables: {raceId}});

  useEffect(() => {
    if (loading) return
    setRace(data.races[0])
  }, [data])

  const goBack = () => {
    router.back()
  }

  if (loading || !race) return <LoadingYachty />;
  const { raceName, startDate, startTime, race_course } = race

  return (
    <>
      <NavBar />
      <Fab size="medium" onClick={goBack} variant="extended" sx={{ margin: 3, alignSelf: 'flex-start' }} color="primary">
        <ArrowBackIcon /> Back
      </Fab>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h4">{ raceName }</Typography>
        <CourseCountDown
          startDate={startDate}
          startTime={startTime}
          course={race.race_course}
          raceStartedCb={setRaceStarted}
        />
        {/* TODO: figure our this no callback with set race */}
        {!raceStarted && userIsCommodore && <SetRaceCourse switchingCourse={true} refetchRace={refetch} />}
        {raceStarted || userIsCommodore &&
          <Stack>
            <Typography variant="h5" >{ race_course?.courseName }</Typography>
            {race_course?.instructions.map((leg, i) => {
              return (
                <Grid key={`${race_course?.courseName}${i}`} container>
                  <Typography sx={{alignSelf: 'center'}} variant="body1">{i + 1}. {leg.marker}&nbsp; </Typography>
                  <Typography sx={{alignSelf: 'center'}} variant="body1"> To: {leg.side}</Typography>
                  <Checkbox color="success" />
                </Grid>
              )
            })}
          </Stack>
        }
      </Stack>
    </>
  )
}

export default Race;

