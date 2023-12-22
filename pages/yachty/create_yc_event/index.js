import { Box, Button, Fab, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@apollo/client';
import { GET_YC_EVENT, INSERT_YC_EVENT, UPDATE_YC_EVENT } from '@/lib/gqlQueries/createYCEventgql';
import ImageUploadField from '@/components/ImageUploadField';
import NavBar from '@/components/NavBar';
import { useEffect, useState } from 'react';
import { YC_EVENT } from '@/slices/actions/authActions';
import { IMG_BUCKET, s3Client } from '@/lib/clients/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import YcEvent from '@/components/YcEvent';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { workingRaceDateAct } from '@/slices/actions/schedulerActions';

const CreateYCEvent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const existingEventId = router.query.eventId;
  const [editingImg, setEditingImg] = useState(true); 
  const ycId = useSelector((state) => state.auth.member.yachtClubByYachtClub.id);
  const workingDate = useSelector(state => state.scheduler.workingRaceDate);

  const [showSpecialHours, setShowSpecialHours] = useState(false);
  const [imageObj, setImageObj] = useState(null);

  const [createYCEvent, { loading: createEventLoading }] = useMutation(INSERT_YC_EVENT);
  const [updateEvent, { loading: updateLoading, data: updateData, error: updateError }] = useMutation(UPDATE_YC_EVENT);
  const {error, loading, data: existingEventData} = useQuery(GET_YC_EVENT, { variables: { id: existingEventId } })

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

  useEffect(() => {
    if (loading) return;
    if (existingEventData) {      
      setEditingImg(false);
      setEventData({...existingEventData.yc_events[0], eventName: existingEventData.yc_events[0].event_name});
    }
    if (imageObj) setFormErrors({...formErrors, imageObjError: false});
  }, [existingEventData, imageObj])

  const editEvent = () => {
    setEventData({
      ...eventData,
      review: false,
    })
  }

  const [formErrors, setFormErrors] = useState({
    eventNameError: false,
    locationError: false,
    startDateError: false,
    endDateError: false,
    imageObjError: false,
  });

  const doSetImgObj = (imageObj) => {
    setImageObj(imageObj);
    setEditingImg(false);
  }

  const {entertainment, eventName, startDate, endDate, specialHoursStart, specialHoursEnd, specialNotes, location, newEventId, review } = eventData;

  const handleSubmit = async (e) => {
    if (entertainment === '') setEventData({...eventData, entertainment: 'none'});
    if (eventName === '') return setFormErrors({...formErrors, eventNameError: true});
    if (location === '') return setFormErrors({...formErrors, locationError: true});
    if (location === '') return setFormErrors({...formErrors, locationError: true});
    if (startDate === '') return setFormErrors({...formErrors, startDateError: true});
    if (endDate === '') return setFormErrors({...formErrors, endDateError: true});
    if (imageObj === null && !existingEventData) return setFormErrors({...formErrors, imageObjError: true})
    let imgPath = null;
    
    if (imageObj) {
      const {fileDatum, src, imgKey} = imageObj;
      const params = {
        Bucket: 'yachty-letter-heads',
        Key: imgKey,
        Body: fileDatum,
        ContentType: 'image/png'
      };
      await s3Client.send(new PutObjectCommand(params));
      imgPath = `${IMG_BUCKET}${imgKey}`;
    } else {
      console.log('eventData =====', eventData)
      imgPath = eventData.image;

    }    

    const startDay = startDate.slice(0, 10);
    const startDayHours = startDate.slice(11);

    const endDay = endDate.slice(0, 10);
    const endDayHours = endDate.slice(11);

    const startTime = startDate.slice(11);
    const endTime = endDate.slice(11);

    const startIsoDate = new Date(startDate).toISOString().slice(0, 10);
    const endIsoDate = new Date(endDate).toISOString().slice(0, 10);

    let date = startDay === endDay ? startDay : `${startDay} to ${endDay}`;
    let specialHours = specialHoursStart === '' || specialHoursEnd === '' ? '' : `${specialHoursStart} to ${specialHoursEnd}`;
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
      endDate: endIsoDate,
      startTime: startTime,
      endTime: endTime,
    };

    if (newEventId || existingEventId) {
      variables.id = newEventId || existingEventId;
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

  const stackStyles = { paddingBottom: 1, textAlign: 'center', width: '100%' };
  // const buttonText = showSpecialHours ? 'Never Mind' : 'Add Special Hours';
  const submittButtonText = newEventId ||existingEventId ? 'Update Event' : 'Create Event';

  const goBack = () => {
    dispatch(workingRaceDateAct(null))
    router.replace({pathname: '/yachty/calendar'})
  }
  const defaultStartDate = workingDate ? dayjs(workingDate.start.value) : null;
  const {
    eventNameError,
    locationError,
    startDateError,
    endDateError,
    imageObjError,
  } = formErrors
  
  return (
    <>
    <NavBar />
      {review ? (
        <YcEvent eventIdProp={newEventId} review={review} edit={editEvent} />
      ) : (
      <Paper sx={{padding: 5, maxWidth: 700, height: '100%', margin: '0 auto', marginTop: 5, marginBottom: 5}} elevation={3}>
        <Stack sx={stackStyles} spacing={5} alignItems="center">
          {workingDate &&
            <Fab
              size="small"
              onClick={goBack}
              variant="extended"
              sx={{
                alignSelf: 'flex-start',
                margin: 3
              }}
              color="primary">
              <ArrowBackIcon />
              Back
            </Fab>
          }
          <Typography variant='h5'>Create Event</Typography>
            <TextField
              fullWidth
              required
              multiline
              variant="standard"
              label="Event Name"
              sx={{ maxWidth: 500 }}
              value={eventData.eventName}
              onChange={(e) => {
                setEventData({...eventData, eventName: e.target.value })
                if (eventNameError) setFormErrors({...formErrors, eventNameError: false})
              }}
            />
            {eventNameError && <Typography color="error">please enter event name</Typography>}
            <TextField
              fullWidth
              required
              multiline
              variant="standard"
              label="Location"
              sx={{ maxWidth: 500 }}
              value={eventData.location}
              onChange={(e) => {
                setEventData({ ...eventData, location: e.target.value })
                if (locationError) return setFormErrors({...formErrors, locationError: false})
              }}
              id="location"
            />
            {locationError && <Typography color="error">please enter location</Typography>}
            <TextField
              fullWidth
              multiline
              variant="standard"
              value={eventData.entertainment}
              label="Entertainment"
              sx={{ maxWidth: 500 }}
              onChange={(e) => setEventData({...eventData, entertainment: e.target.value })}
              id="entertainment"
            />
            <Grid container direction="row" spacing={2} justifyContent="space-around">
              <Grid textAlign="center">
                <Typography sx={{margin: 2}}>From</Typography>
                <DateTimeField
                  required
                  fullWidth
                  onBlur={(e) => {
                    setEventData({...eventData, startDate: e.target.value})
                    if (startDateError) return setFormErrors({...formErrors, startDateError: false})
                  }}
                  label="Date Time"
                  defaultValue={defaultStartDate || dayjs(new Date())}
                />
                {startDateError && <Typography color="error">please enter a start date and time</Typography>}
              </Grid>
              <Grid textAlign="center">
                <Typography sx={{margin: 2}}>To</Typography>
                <DateTimeField
                  required
                  onBlur={(e) => {
                    setEventData({...eventData, endDate: e.target.value})
                    if (endDateError) return setFormErrors({...formErrors, endDateError: false})
                  }}
                  label="Date Time"
                  defaultValue={dayjs(new Date())}
                />
                {endDateError && <Typography>please enter event end date and time</Typography>}
              </Grid>
            </Grid>
            {!editingImg &&
            <>
              <Fab onClick={setEditingImg} color='primary'>
                <EditIcon />
              </Fab>
              <Box
                component="img"                
                sx={{
                  borderRadius: 3,                  
                  height: '100%',
                  width: 250,
                }}
                alt="Event Image"
                src={imageObj?.src || existingEventData?.yc_events[0]?.image}
              />
            </>
            }
            {editingImg && <ImageUploadField type={YC_EVENT} setImageObjToParent={doSetImgObj} img={imageObj} title="Event Poster" />}
            {imageObjError && <Typography color="red" >please upload event poster image</Typography>}
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
            fullWidth
            multiline            
            variant="standard"
            label="Special Notes"
            value={eventData.specialNotes}
            sx={{ maxWidth: 500 }}
            onChange={(e) => setEventData({...eventData, specialNotes: e.target.value })}
          />
          <Button color='success' onClick={handleSubmit}>{ submittButtonText }</Button>
        </Stack>
      </Paper>)}
    </>
  );
};

export default CreateYCEvent;