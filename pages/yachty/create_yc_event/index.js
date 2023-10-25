import { Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import dayjs from 'dayjs';
import { useMutation } from '@apollo/client';
import { INSERT_YC_EVENT, UPDATE_YC_EVENT } from '@/lib/gqlQueries/createYCEventgql';
import ImageUploadField from '@/components/ImageUploadField';
import NavBar from '@/components/NavBar';
import { useState } from 'react';
import { YC_EVENT } from '@/slices/actions/authActions';
import { IMG_BUCKET, s3Client } from '@/lib/clients/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import YcEvent from '@/components/YcEvent';
import { useSelector } from 'react-redux';

const CreateYCEvent = () => {
  const ycId = useSelector((state) => state.auth.member.yachtClubByYachtClub.id);
  const [createYCEvent, { loading, data, error }] = useMutation(INSERT_YC_EVENT);
  const [updateEvent, { loading: updateLoading, data: updateData, error: updateError }] = useMutation(UPDATE_YC_EVENT);
  const [showSpecialHours, setShowSpecialHours] = useState(false);
  const [imageObj, setImageObj] = useState(null);
  
  const [eventData, setEventData] = useState({
    entertainment: '',
    eventName: '',
    location: '',
    hours: '',
    startDate: '',
    endDate: '',
    specialHoursStart: '',
    specialHoursEnd: '',
    specialNotes: '',
    newEventId: null,
    review: false,
  });

  const editEvent = () => {
    setEventData({
      ...eventData,
      review: false,
    })
  }

  const {entertainment, eventName, startDate, endDate, specialHoursStart, specialHoursEnd, specialNotes, location, newEventId, review } = eventData;

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
    const startDay = startDate.slice(0, 10);
    const startDayHours = startDate.slice(11);

    const endDay = endDate.slice(0, 10);
    const endDayHours = endDate.slice(11);

    const startIsoDate = new Date(startDate).toISOString().slice(0, 10);

    let date = startDay === endDay? startDay : `${startDay} to ${endDay}`;
    let specialHours = specialHoursStart === '' || specialHoursEnd === ''? '' : `${specialHoursStart} to ${specialHoursEnd}`;
    let hours = startDayHours === endDayHours? startDayHours : `${startDayHours} to ${endDayHours}`;
    let variables = {
      ycId,
      image: imgPath,
      specialClubHours: specialHours,
      entertainment,
      eventName,
      hours,
      date,
      eventName,
      location,
      specialNotes,
      startDate: startIsoDate,
    };

    if (newEventId) {
      variables.id = newEventId;
      const resp = await updateEvent({ variables });
      setEventData({...eventData ,review: true});
    } else {
      const resp = await createYCEvent({ variables });
      const eventId = resp.data.insert_yc_events.returning[0].id;
      setEventData({
        ...eventData,
        newEventId: eventId,
        review: true,
      });
    }
  }
  const stackStyles = { paddingBottom: 1, textAlign: 'center', width: '100%', maxWidth: 700 };
  // const buttonText = showSpecialHours ? 'Never Mind' : 'Add Special Hours';
  const submittButtonText = newEventId ? 'Update Event' : 'Create Event';
  
  return (
    <>
    <NavBar />
      {review ? (
        <YcEvent eventIdProp={newEventId} review={review} edit={editEvent} />
      ) : (
      <Paper sx={{padding: 5, maxWidth: 700, maxHeight: 1150, margin: '0 auto', marginBottom: 10}} elevation={3}>
        <Stack sx={stackStyles} spacing={5} alignItems="center">
          <Typography variant='h5'>Create Event</Typography>
            <TextField
              required
              multiline
              variant="standard"
              label="Event Name"
              value={eventData.eventName}
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
                multiline
                value={eventData.entertainment}
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
          {/* <Button color='success' onClick={() => setShowSpecialHours(!showSpecialHours)}>{ buttonText }</Button>
          {showSpecialHours && <Grid container direction="row" spacing={2} justifyContent="space-around">
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>From</Typography>
              <DateTimeField onBlur={(e) => setEventData({...eventData, specialHoursStart: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} />
            </Grid>
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>To</Typography>
              <DateTimeField onBlur={(e) => setEventData({...eventData, specialHoursEnd: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} />
            </Grid>
          </Grid>} */}
          <TextField
            onChange={(e) => setEventData({...eventData, specialNotes: e.target.value })}
            variant="standard"
            label="Special Notes"
            multiline
            maxRows={4}
            sx={{width: '100%'}}
          />
          <Button color='success' onClick={handleSubmit}>{ submittButtonText }</Button>
        </Stack>
      </Paper>)}
    </>
  );
};

export default CreateYCEvent;