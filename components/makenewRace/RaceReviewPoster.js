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
import { getNormalDateFromDaysjsString } from '@/lib/utils/getters';
import RaceOptionsMenu from '../RaceOptionsMenu';


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
  const [expanded, setExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const burgee = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const series = useSelector(state => state.workingRace.series);
  const course = useSelector(state => state.workingRace.course);
  const raceName = useSelector(state => state.workingRace.raceName);
  const startDate = useSelector(state => state.workingRace.startDate);
  const endDate = useSelector(state => state.workingRace.endDate);
  const release = useSelector(state => state.workingRace.release);
  const image = useSelector(state => state.workingRace.imageObj)
  console.log('series ========', series)
  const handleClose = () => setShowSuccess(false);

  const handleExpandClick = () => setExpanded(!expanded);

  const goToReservations = () => {
    router.push({
      pathname: '/yachty/racing/reservations',
      // query: {raceId, eventId}
    })
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
          <IconButton>
            <Typography color="primary">Confirm Race&nbsp;</Typography>
            <ConfirmationNumberIcon color="success" />
          </IconButton>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default RaceReviewPoster;