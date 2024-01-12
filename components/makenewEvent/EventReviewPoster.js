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
import { useSelector } from 'react-redux';
import { Alert, Grid, Snackbar } from '@mui/material';
import { useRouter } from 'next/router';
import { getNormalCalanderDate, getNormalDateFromDaysjsString } from '@/lib/utils/getters';
import { useMutation } from '@apollo/client';
import { INSERT_YC_EVENT } from '@/lib/gqlQueries/createYCEventgql';
import { getHasuraDate } from '@/lib/utils/dateStrings';
import dayjs from 'dayjs';

const EventReviewPoster = ({ race }) => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const burgee = useSelector(state => state.auth.member.yachtClubByYachtClub.logo)
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id)
  const name = useSelector(state => state.workingEvent.name)
  const location = useSelector(state => state.workingEvent.location)
  const startDate = useSelector(state => state.workingEvent.startDate)
  const endDate = useSelector(state => state.workingEvent.endDate)
  const specialNotes = useSelector(state => state.workingEvent.specialNotes)
  const entertainment = useSelector(state => state.workingEvent.entertainment)
  const image = useSelector(state => state.workingEvent.image)

  const [insertEvent, { loading: createEventLoading }] = useMutation(INSERT_YC_EVENT);

  const handleClose = () => setShowSuccess(false);

  const createTickets = (eventId) => {
    router.push({
      pathname: '/yachty/make_new_event/review/create_ticket',
      query: {eventId}
    })
  }
  const confirmEvent = async () => {
    const {fileDatum, src, imgKey} = image;
    const imagePath = `${IMG_BUCKET}${imgKey}`;
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
    const hasuraStartDate = getHasuraDate(dayjs(startDate));
    const hasuraEndDate = getHasuraDate(dayjs(endDate))

    const variables = {
      location,
      entertainment,
      image: imagePath,
      eventName: name,
      startDate: hasuraStartDate,
      endDate: hasuraEndDate,
      startTime,
      endTime,
      ycId: ycId,
    };
    const resp = await insertEvent({variables})
    createTickets(resp.data.insert_yc_events.returning[0].id)
  }
  // const { posterWidth } = posterStyles;

  const {fullDay: startDay, time: startTime} = getNormalDateFromDaysjsString(startDate);
  const {fullDay: endDay, time: endTime} = getNormalDateFromDaysjsString(endDate);

  return (
    <Card>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          url copied to clipboard
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
        image={image.fileDatum}
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