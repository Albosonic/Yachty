import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import NavBar from "@/components/NavBar";
import { GET_RACE_BY_ID } from "@/lib/gqlQueries/racinggql";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Fab, Stack, Typography } from "@mui/material";
import LoadingYachty from "@/components/LoadingYachty";
import SetRaceCourse from "@/components/makenewRace/SetRaceCourse";


const Counter = ({ startDate, startTime }) => {
  const [countDown, setCountDown] = useState()
  useEffect(() => {
    setCountDown(<LoadingYachty isRoot={false} />)
    setInterval(() => {
      const start = new Date(`${startDate} ${startTime}`).getTime()
      const now = new Date().getTime()
      const diff = start - now
      let seconds = (diff / 1000).toFixed(1)
      let minutes = (diff / (1000 * 60)).toFixed(1)
      let hours = (diff / (1000 * 60 * 60)).toFixed(1)
      let days = (diff / (1000 * 60 * 60 * 24)).toFixed(1)
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
  return countDown;
}



const Race = () => {
  const router = useRouter();
  const raceId = router.query.raceId;
  const [race, setRace] = useState({})
  const {error, loading, data} = useQuery(GET_RACE_BY_ID, {variables: {raceId}});

  useEffect(() => {
    if (loading) return
    setRace(data.races[0])
  }, [data])

  const goBack = () => {
    router.back()
  }

  if (loading) return <LoadingYachty />;
  const {raceName, startDate, startTime} = race

  return (
    <>
      <NavBar />
      <Fab size="medium" onClick={goBack} variant="extended" sx={{ margin: 3, alignSelf: 'flex-start' }} color="primary">
        <ArrowBackIcon /> Back
      </Fab>
      <Stack spacing={4} alignItems="center">
        <Typography variant="h4">{ raceName } Race</Typography>
        <Counter startDate={startDate} startTime={startTime} />
        <SetRaceCourse />
        <Button size="small" fullWidth sx={{padding: 2, borderRadius: 0, bottom: 0, position: 'absolute'}} variant="outlined">
          Start Race
        </Button>
      </Stack>
    </>
  )
}

export default Race;