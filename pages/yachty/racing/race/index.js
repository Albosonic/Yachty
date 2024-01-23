import { GET_RACE_BY_ID } from "@/lib/gqlQueries/racinggql";
import { useQuery } from "@apollo/client";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

const Race = () => {
  const router = useRouter();
  const raceId = router.query.raceId;
  const {error, loading, data: race} = useQuery(GET_RACE_BY_ID, {variables: {raceId}});

  const Counter = ({minutes}) => {
    // const [time, setTime] = useState();
    let seconds = 60;    
    let timeRemaining = `${minutes}:${seconds}`;

    return (
      <Typography>{ seconds }</Typography>
    )
  }

  if (loading) return <CircularProgress />;

  return (
    <Stack alignItems="center">
      <Typography variant="h4">Race</Typography>
      <Stack>
        <Counter minutes={5} />
      </Stack>
      <Button size="large" fullWidth sx={{padding: 2, borderRadius: 0, bottom: 0, position: 'absolute'}} variant="outlined">
        Start Race
      </Button>
    </Stack>
  )
}

export default Race;