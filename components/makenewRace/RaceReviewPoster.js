import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Grid, Snackbar } from '@mui/material';
// import RaceOptionsMenu from '../RaceOptionsMenu';

import { useRouter } from 'next/router';
import { usePosterStyles } from '../componentHooks/usePosterStyles';
import { getNormalCalanderDate, getNormalDateFromDaysjsString } from '@/lib/utils/getters';
import RaceOptionsMenu from '../RaceOptionsMenu';
import { useMutation } from '@apollo/client';
import { INSERT_RACE_ONE } from '@/lib/gqlQueries/racinggql';
import { IMG_BUCKET, s3Client } from '@/lib/clients/s3-client';
import { PutObjectCommand } from '@aws-sdk/client-s3';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const RaceReviewPoster = ({ race }) => {
  const router = useRouter();
  const posterStyles = usePosterStyles();
  const [showSuccess, setShowSuccess] = useState(false);
  const burgee = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const series = useSelector(state => state.workingRace.series);
  const course = useSelector(state => state.workingRace.course);
  const raceName = useSelector(state => state.workingRace.raceName);
  const startDate = useSelector(state => state.workingRace.startDate);
  const endDate = useSelector(state => state.workingRace.endDate);
  const release = useSelector(state => state.workingRace.release);
  const image = useSelector(state => state.workingRace.imageObj)
  const [insertRace, {loading: insertRaceLoading}] = useMutation(INSERT_RACE_ONE);
  const handleClose = () => setShowSuccess(false);

  const createTickets = (raceId) => {
    router.push({
      pathname: '/yachty/create_races/create_tickets',
      query: {raceId}
    })
  }
  const confirmRace = async () => {
    const {fileDatum, src, imgKey} = image;
    const { id: courseId } = course;
    const imagePath = `${IMG_BUCKET}${imgKey}`;

    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: fileDatum,
      ContentType: 'image/png'
    };
    
    await s3Client.send(new PutObjectCommand(params));

    const {fullDay: startDay, time: startTime} = getNormalDateFromDaysjsString(startDate);
    const {fullDay: endDay, time: endTime} = getNormalDateFromDaysjsString(endDate);
    
    const isoStart = new Date(startDate).toISOString()
    const isoEnd = new Date(endDate).toISOString()

    const normalStartDay = getNormalCalanderDate(isoStart)
    const normalEndDay = getNormalCalanderDate(isoEnd)
    const variables = {
      object: {
        seriesId: series.id,
        eventId: null,
        img: imagePath,
        raceName,
        raceCourseId: courseId,
        startDate: normalStartDay,
        endDate: normalEndDay,
        ycId: ycId,
        startTime,
        endTime,
        releaseFormId: release.id,
      }
    };
    const resp = await insertRace({variables})
    createTickets(resp.data.insert_races_one.id)
    console.log('resp =======', resp);
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
        title={raceName}        
        subheader={`${startDay}${startTime} - ${endTime}`}
      />
      <CardMedia
        component="img"
        height="100%"
        image={image.fileDatum}
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