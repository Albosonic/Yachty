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

// import DatePicker from '@/components/DatePicker';

// $ycId: uuid, 
// $specialClubHours: String, 
// entertainment: String, 
// $eventName: String, 
// $hours: String, 
// $hours: String, 
// $date: String

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
  
  const handleSubmit = async (e) => {
    const {fileDatum, src, imgKey} = imageObj;
    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: fileDatum,
      ContentType: 'image/png'
    };
    const results = await s3Client.send(new PutObjectCommand(params));

    const imgPath = `${IMG_BUCKET}${imgKey}`;
    const {entertainment, eventName, startDate, endDate, specialHoursStart, specialHoursEnd, specialNotes } = eventData;
    const startDay = startDate.slice(0, 10);
    const startDayHours = startDate.slice(11);
    
    const endDay = endDate.slice(0, 10);
    const endDayHours = endDate.slice(11);
    
    await createYCEvent({
      variables: {
        ycId,
        image: imgPath,
        specialClubHours: `${specialHoursStart} - ${specialHoursEnd}`,
        entertainment,
        eventName,
        hours: `${startDayHours} - ${endDayHours}`,
        date: `${startDay} - ${endDay}`,
        eventName
      },
    });  
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
              <DateTimeField onClick={(e) => setEventData({...eventData, startDate: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} /> 
            </Grid>
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>To</Typography>
              <DateTimeField onClick={(e) => setEventData({...eventData, endDate: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} />
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
              <DateTimeField onClick={(e) => setEventData({...eventData, specialHoursStart: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} /> 
            </Grid>
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>To</Typography>
              <DateTimeField onClick={(e) => setEventData({...eventData, specialHoursEnd: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} />
            </Grid>
          </Grid>}
          <TextField
            onClick={(e) => setEventData({...eventData, specialNotes: e.target.value })}
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