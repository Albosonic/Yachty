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
import { getNormalDateFromDaysjsString } from '@/lib/utils/getters';
import { useMutation } from '@apollo/client';
import { INSERT_RACE_ONE, UPDATE_RACE } from '@/lib/gqlQueries/racinggql';
import { getFriendlyDateAndTime, getHasuraDate } from '@/lib/utils/dateStrings';
import dayjs from 'dayjs';
import { clearNewRaceFieldsAct } from '@/slices/actions/workingRaceActions';
import LoadingYachty from '../LoadingYachty';


const RaceReviewPoster = ({ race }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [showSuccess, setShowSuccess] = useState(false)
  const burgee = useSelector(state => state.auth.member.yachtClubByYachtClub.logo)
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id)
  const series = useSelector(state => state.workingRace.series)
  const course = useSelector(state => state.workingRace.course)
  const raceName = useSelector(state => state.workingRace.raceName)
  const startDate = useSelector(state => state.workingRace.startDate)
  const endDate = useSelector(state => state.workingRace.endDate)
  const release = useSelector(state => state.workingRace.release)
  const image = useSelector(state => state.workingRace.image)
  const raceId = useSelector(state => state.workingRace.raceId)
  const existingRace = useSelector(state => state.workingRace.existingRace)
  const existingImg = useSelector(state => state.workingRace.existingImg)
  const inReview = useSelector(state => state.workingRace.inReview)

  const [insertRace, {loading: insertRaceLoading}] = useMutation(INSERT_RACE_ONE)
  const [updateRace, {loading: updateRaceLoading}] = useMutation(UPDATE_RACE)

  const handleClose = () => {
    setShowSuccess(false)
    dispatch(clearNewRaceFieldsAct())
    router.replace({pathname: '/yachty', query: { ycId: ycId }})
  }

  const createTickets = (raceId) => {
    router.push({
      pathname: '/yachty/make_new_race/review/create_ticket',
      query: {raceId}
    })
  }
  const confirmRace = async () => {    
    const {fileDatum, src, imgKey} = image;
    const { id: courseId } = course;
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
      const results = await s3Client.send(new PutObjectCommand(params))
    }    

    const variables = {
      object: {
        seriesId: series.id,
        eventId: null,
        img: imagePath,
        raceName,
        raceCourseId: courseId,
        startDate: existingRace ? startDate : getHasuraDate(dayjs(startDate)),
        endDate: existingRace ? endDate : getHasuraDate(dayjs(endDate)),
        ycId: ycId,
        startTime,
        endTime,
        releaseFormId: release.id,
      }
    };
    if (existingRace) {
      if (existingImg) variables.object.img = existingImg;
      variables.raceId = raceId;
      const resp = await updateRace({variables})      
      setShowSuccess(true)
    } else {
      const resp = await insertRace({variables})
      createTickets(resp.data.insert_races_one.id)
    }
  }
  // const { posterWidth } = posterStyles;

  const {fullDay: startDay, time: startTime} = getNormalDateFromDaysjsString(startDate);
  const {fullDay: endDay, time: endTime} = getNormalDateFromDaysjsString(endDate);

  const subheader = getFriendlyDateAndTime(startDate, endDate, startTime, endTime);
  console.log('in review', inReview)
  if (!inReview || updateRaceLoading) return <LoadingYachty isRoot={false} />
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
        title={raceName}
        subheader={subheader}
      />
      <CardMedia
        component="img"
        height="100%"
        width= "100%"        
        image={image.fileDatum || existingImg}
        alt="Race Image"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">{series.seriesName}</Typography>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="space-between">
          <IconButton onClick={() => router.replace({pathname: '/yachty/make_new_race'})}>
            <ArrowBackIcon color="primary" />
            <Typography color="primary">back to edit</Typography>
          </IconButton>
          <IconButton onClick={confirmRace}>
            <Typography color="primary">Confirm Race&nbsp;</Typography>
            <ConfirmationNumberIcon color="success" />
          </IconButton>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default RaceReviewPoster;