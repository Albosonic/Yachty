import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RecommendIcon from '@mui/icons-material/Recommend';
import { GET_EVENT_COMMENTS, INSERT_EVENT_COMMENT } from "@/lib/gqlQueries/ycFeedgql";
import { useMutation, useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Grid, IconButton, Paper, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import SelectedTimeRange from "./SelectedTimeRange";

const RaceEventPoster = ({ raceData }) => {
  const router = useRouter();
  const {
    endDate,
    endTime,
    eventId,
    img: image,
    raceCourseId,
    raceName,
    startDate,
    startTime,
    race_tickets_for_purchase,
    yc_event,
    id: raceId
  } = raceData;

  const raceTicketId = race_tickets_for_purchase?.id;

  const moreThan600px = useMediaQuery('(min-width:600px)');
  const posterWidth = moreThan600px ? 550 : 300;

  return (
    <>
      <Paper sx={{padding: 5, maxWidth: 700, margin: '0 auto', marginBottom: 5, marginTop: 5 }} elevation={3}>
        <Stack display="flex"
          alignItems="center"
          sx={{
            margin: '0 auto',
            border: '1px solid black',
            minWidth: posterWidth,
          }}
        >
          <SelectedTimeRange startDate={startDate + startTime} endDate={endDate + endTime} />
          <Typography variant="h3" sx={{margin: 3}}>{ raceName }</Typography>
          <Box
            component="img"
            sx={{
              height: '100%',
              width: '100%',
              // maxWidth: 500,
              padding: 5,
            }}
            alt="The house from the offer."
            src={image}
          />

          <Grid container justifyContent="space-around">
            <Button
              onClick={() => router.push({
                pathname: '/yachty/racing/reservations',
                query: {raceId, eventId}
              })}
            >
              RSVP
            </Button>
            {/* {isCommodore && <Button onClick={() => router.push({pathname: '/yachty/yc_feed/see_event_res', query: {eventId}})}>See Member RSVP</Button>} */}
          </Grid>
        </Stack>
      </Paper>
    </>
  )
};

export default RaceEventPoster;