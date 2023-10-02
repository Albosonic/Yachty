import { useRouter } from 'next/router';
import { Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

import dayjs from 'dayjs';
import { useMutation } from '@apollo/client';
import { INSERT_YC_EVENT } from './createYCEventgql';
import ImageUploadField from '@/components/ImageUploadField';
import NavBar from '@/components/NavBar';
import styled from '@emotion/styled';
import { useState } from 'react';
import { YC_EVENT } from '@/slices/actions/authActions';
import { IMG_BUCKET, s3Client } from '@/pages/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const CreateYCEvent = () => {
  const router = useRouter();
  const ycId = router.query.ycId;
  const [createYCEvent, { loading, data, error }] = useMutation(INSERT_YC_EVENT);
  const [showSpecialHours, setShowSpecialHours] = useState(false);
  const [imageObj, setImageObj] = useState(null);
  const [eventData, setEventData] = useState({
    entertainment: '',
    eventName: '',
    hours: '',
    startDate: '',
    endDate: '',
    specialHoursStart: '',
    specialHoursEnd: '',
    specialNotes: '',
  });
  console.log('eventData', eventData);
  const handleSubmit = async (e) => {
    const {fileDatum, src, imgKey} = imageObj;
    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: fileDatum,
      ContentType: 'image/png'
    };
    
    await s3Client.send(new PutObjectCommand(params));
    const imgPath = `${IMG_BUCKET}${imgKey}`;
    const {entertainment, eventName, startDate, endDate, specialHoursStart, specialHoursEnd, specialNotes } = eventData;
    const startDay = startDate.slice(0, 10);
    const startDayHours = startDate.slice(11);
    
    const endDay = endDate.slice(0, 10);
    const endDayHours = endDate.slice(11);
    
    // console.log('whooo', eventData)
    console.log('start', startDayHours)
    console.log('endDay', endDayHours)

    let date = startDay === endDay? startDay : `${startDay} to ${endDay}`;

    let variables = {
      ycId,
      image: imgPath,
      specialClubHours: `${specialHoursStart} to ${specialHoursEnd}`,
      entertainment,
      eventName,
      hours: `${startDayHours} to ${endDayHours}`,
      date,
      eventName
    }
    console.log('variables', variables);
    const resp = await createYCEvent({
      variables
    });  
    const eventId = resp.data.insert_yc_events.returning[0].id;
    console.log('resp', resp);
    console.log('eventId', eventId);
    // TODO:  snackbar and handle close.
    // router.push({
    //   pathname: '/yachty/create_yc_event/create_event_ticket', 
    //   query: { 
    //     eventId
    //   }
    // });    
  }
  const stackStyles = {
    paddingBottom: 1,
    textAlign: 'center',
    width: '100%',
    maxWidth: 700,
    marginBottom: 10
  }
  const buttonText = showSpecialHours ? 'Never Mind' : 'Add Special Hours';
  return (
    <>
    <NavBar />
      <Paper sx={{padding: 5, maxWidth: 700, margin: '0 auto'}} elevation={3}>
        <Stack sx={stackStyles} spacing={5} alignItems="center" >
          <Typography variant='h5'>Create Event</Typography>
          <TextField 
            multiline 
            variant="standard" 
            label="Event Name" 
            size="normal"
            onChange={(e) => setEventData({...eventData, eventName: e.target.value })}
          />
          <Grid container justifyContent="space-around">
            <Grid textAlign="left">
              <Typography onChange={(e) => setEventData({ ...eventData, eventName: e.target.value })}>Location</Typography>
              <TextField
                required
                onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                variant="standard"
                id="location"
                label="eg: ballroom..." 
                multiline
                value={eventData.location}
              />
            </Grid>
            <Grid textAlign="left">
              <Typography>Entertainment</Typography>
              <TextField
                required
                onChange={(e) => setEventData({...eventData, entertainment: e.target.value })}
                variant="standard"
                id="entertainment"
                label="eg: yc presents..."
                multiline
                maxRows={4}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2} justifyContent="space-around">
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>From</Typography>
              <DateTimeField onBlur={(e) => setEventData({...eventData, startDate: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} /> 
            </Grid>
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>To</Typography>
              <DateTimeField onBlur={(e) => setEventData({...eventData, endDate: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} />
            </Grid>
          </Grid>
          <ImageUploadField type={YC_EVENT} setImageObjToParent={setImageObj} img={imageObj} />
          <Typography sx={{marginBottom: 0}}>
            Add special hours if the yacht clubs regular hours will be different. (optional)
          </Typography>
          <Button color='success' onClick={() => setShowSpecialHours(!showSpecialHours)}>{ buttonText }</Button>
          {showSpecialHours && <Grid container direction="row" spacing={2} justifyContent="space-around">
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>From</Typography>
              <DateTimeField onBlur={(e) => setEventData({...eventData, specialHoursStart: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} /> 
            </Grid>
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>To</Typography>
              <DateTimeField onBlur={(e) => setEventData({...eventData, specialHoursEnd: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} />
            </Grid>
          </Grid>}
          <TextField
            onChange={(e) => setEventData({...eventData, specialNotes: e.target.value })}
            variant="standard" 
            label="Special Notes"
            multiline
            maxRows={4}
            sx={{width: '100%'}}
          />
          <Button color='success' onClick={handleSubmit}>Create Event</Button>
        </Stack>
      </Paper>
    </>
  );
};

export default CreateYCEvent;