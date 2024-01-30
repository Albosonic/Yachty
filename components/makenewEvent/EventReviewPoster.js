import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { IMG_BUCKET, s3Client } from '@/lib/clients/s3-client';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Grid, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { getNormalCalanderDate, getNormalDateFromDaysjsString } from '@/lib/utils/getters';
import { useMutation } from '@apollo/client';
import { INSERT_YC_EVENT, UPDATE_EVENT } from '@/lib/gqlQueries/createYCEventgql';
import { getHasuraDate } from '@/lib/utils/dateStrings';
import dayjs from 'dayjs';
import LoadingYachty from '../LoadingYachty';
import { clearNewEventFieldsAct } from '@/slices/actions/workingEventActions';

const EventReviewPoster = ({ race }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [showSuccess, setShowSuccess] = useState(false);
  const burgee = useSelector(state => state.auth.member.yachtClubByYachtClub.logo)
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id)
  const name = useSelector(state => state.workingEvent.name)
  const location = useSelector(state => state.workingEvent.location)
  const startDate = useSelector(state => state.workingEvent.startDate)
  const endDate = useSelector(state => state.workingEvent.endDate)
  const specialNotes = useSelector(state => state.workingEvent.specialNotes)
  const entertainment = useSelector(state => state.workingEvent.entertainment)
  const existingEvent = useSelector(state => state.workingEvent.existingEvent)
  const existingImg = useSelector(state => state.workingEvent.existingImage)
  const inReview = useSelector(state => state.workingEvent.inReview)
  const eventId = useSelector(state => state.workingEvent.eventId)
  const image = useSelector(state => state.workingEvent.image)

  const [insertEvent, { loading: createEventLoading }] = useMutation(INSERT_YC_EVENT)
  const [updateEvent, { loading: updateEventLoading }] = useMutation(UPDATE_EVENT)

  const handleClose = () => {
    setShowSuccess(false)
    dispatch(clearNewEventFieldsAct())
    router.replace({pathname: '/yachty', query: { ycId: ycId }})
  }

  const createTickets = (eventId) => {
    router.push({
      pathname: '/yachty/make_new_event/review/create_ticket',
      query: {eventId}
    })
  }
  const confirmEvent = async () => {
    const {fileDatum, src, imgKey} = image;
    let imagePath = `${IMG_BUCKET}${imgKey}`;

    if (!existingImg) {
      const base64Data = new Buffer.from(fileDatum.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      const type = fileDatum.split(';')[0].split('/')[1];
      const params = {
        Bucket: 'yachty-letter-heads',
        Key: imgKey,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/png${type}`
      };
      const results = await s3Client.send(new PutObjectCommand(params));
    }




    // TODO: fix this!!!!!!
    if (existingEvent) {        
      const variables = {
        eventId,
        object: {
          location,
          entertainment,
          image: imagePath,
          event_name: name,
          specialNotes,
          startDate,
          endDate,
          startTime,
          endTime,
          ycId,
        }
      };
      const resp = await updateEvent({variables})
      setShowSuccess(true)
    } else {
      const variables = {
        location,
        entertainment,
        image: imagePath,
        eventName: name,
        specialNotes,
        startDate: getHasuraDate(dayjs(startDate)),
        endDate: getHasuraDate(dayjs(endDate)),
        startTime,
        endTime,
        ycId,
      };
      const resp = await insertEvent({variables})
      createTickets(resp.data.insert_yc_events.returning[0].id)
    }
  }
  // const { posterWidth } = posterStyles;
  if (!inReview || updateEventLoading || createEventLoading) return <LoadingYachty isRoot={false} />

  const {fullDay: startDay, time: startTime} = getNormalDateFromDaysjsString(startDate);
  const {fullDay: endDay, time: endTime} = getNormalDateFromDaysjsString(endDate);


  return (
    <Card>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          All Set!
        </Alert>
      </Snackbar>
      <CardHeader
        avatar={<Avatar src={burgee} aria-label="burgee" />}
        // action={<RaceOptionsMenu raceId={raceId} releaseFormId={releaseFormId} goToReservations={goToReservations} />}
        title={name}
        subheader={`${startDay}${startTime} - ${endTime}`}
      />
      <CardMedia
        component="img"
        height="100%"
        image={image.fileDatum || existingImg}
        alt="Race Image"
      />
      <CardContent>
        <Typography>At {location}</Typography>
        {entertainment && <Typography>Featuring: {entertainment}</Typography>}
        {specialNotes && <Typography>Notes: {specialNotes}</Typography>}

      </CardContent>
      <CardActions>
        <Grid container justifyContent="space-between">
          <IconButton onClick={() => router.replace({pathname: '/yachty/make_new_event'})}>
            <ArrowBackIcon color="primary" />
            <Typography color="primary">back to edit</Typography>
          </IconButton>
          <IconButton onClick={confirmEvent}>
            <Typography color="primary">Confirm Event&nbsp;</Typography>
            <ConfirmationNumberIcon color="success" />
          </IconButton>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default EventReviewPoster;