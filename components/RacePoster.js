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
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Snackbar } from '@mui/material';
import RaceOptionsMenu from './RaceOptionsMenu';
import { useRouter } from 'next/router';
import RaceParticipants from './RaceParticipants';
import { usePosterStyles } from './componentHooks/usePosterStyles';

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

const RacePoster = ({ shareData, race }) => {
  console.log('wtfwtfwtf ============', race)
  const router = useRouter();
  const posterStyles = usePosterStyles();
  const [expanded, setExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const burgee = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const member = useSelector(state => state.auth.member);

  const handleClose = () => setShowSuccess(false);
  const handleExpandClick = () => setExpanded(!expanded);
  
  const shareClick = async () => {    
    const resp = await navigator.permissions.query({ name: "clipboard-write" });
    const origin = window.location.origin;
    const newClipResp = await navigator.clipboard.writeText(`${origin}/yachty/racer?memberId=${member.id}`).then(
      (what) => setShowSuccess(true),
      (the) => console.log("copy text failed"),
    );
  }
  
  const { raceName, startDate, startTime, img, id: raceId, eventId, race_release_forms: { id: releaseFormId} } = race;

  const goToReservations = () => {
    router.push({
      pathname: '/yachty/racing/reservations',
      query: {raceId, eventId}
    })
  }
  const { posterWidth } = posterStyles;
  return (
    <Card sx={{ width: posterWidth }}>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          url copied to clipboard
        </Alert>
      </Snackbar>      
      <CardHeader
        avatar={<Avatar src={burgee} aria-label="burgee" />}
        action={<RaceOptionsMenu raceId={raceId} />}
        title={raceName}
        subheader={`${startDate} ${startTime}`}
      />
      <CardMedia
        component="img"
        height="100%"
        image={img}
        alt="Race Image"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">put a brief race description here maybe</Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={shareClick} aria-label="share">
          <ShareIcon />
        </IconButton>        
        <IconButton onClick={ goToReservations } 
          color="success" 
          aria-label="add to favorites"
        >
          <HowToRegIcon />
          <Typography>Register</Typography>
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <RaceParticipants raceId={raceId} releaseFormId={releaseFormId} />
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default RacePoster;
