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
import { useRouter } from 'next/router';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Snackbar, useMediaQuery } from '@mui/material';
import EventCommentsList from './EventCommentsList';
import { usePosterStyles } from './componentHooks/usePosterStyles';
import EventOptionsMenu from './EventOptionsMenu';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create(
    'transform', 
    { duration: theme.transitions.duration.shortest }),
}));

const YcEventPoster = ({ eventData }) => {
  const router = useRouter();
  const posterStyles = usePosterStyles();
  const [expanded, setExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const burgee = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);  
  const handleClose = () => setShowSuccess(false)
  const handleExpandClick = () => setExpanded(!expanded);  
  const goToReservations = () => router.push({pathname: '/yachty/yc_feed/purchase_event_ticket', query: {eventId}});

  const shareClick = async () => {
    const resp = await navigator.permissions.query({ name: "clipboard-write" });
    const origin = window.location.origin;
    const newClipResp = await navigator.clipboard.writeText(`${origin}/yachty/event_view?eventId=${eventId}`).then(
      (what) => setShowSuccess(true),
      (the) => console.log("copy text failed"),
    );
  }

  const { posterWidth } = posterStyles;
  const { 
    image, 
    event_name: eventName, 
    hours,    
    specialNotes, 
    id: eventId,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    entertainment,
  } = eventData;

  console.log('event =============', eventData)

  const makeSubheader = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const friendlyStartDay = start.toString().slice(0, 10)
    const friendlyEndDate = end.toString().slice(0, 10)
    if (startDate === endDate) {
      return `${friendlyStartDay} ${startTime} - ${endTime}`
    } else {
      return `${friendlyStartDay} ${startTime} - ${friendlyEndDate} ${endTime}`
    }
  }
  const subheader = makeSubheader();
  return (
    <Card sx={{ width: posterWidth }}>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          url copied to clipboard
        </Alert>
      </Snackbar>      
      <CardHeader
        avatar={<Avatar src={burgee} aria-label="burgee" />}
        action={<EventOptionsMenu eventId={eventId} />}
        title={eventName}
        subheader={subheader}
      />
      <CardMedia
        component="img"
        // height="194"
        image={image}
        alt="Event Image"
      />
      <CardContent>        
        <Typography>Location: {location}</Typography>
        <Typography>Entertainment: {entertainment}</Typography>
        {specialNotes && <Typography>Notes: {specialNotes}</Typography>}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={shareClick} aria-label="share">
          <ShareIcon />
        </IconButton>        
        
        <IconButton 
          onClick={goToReservations} 
          color="success" 
          aria-label="add to favorites"
        >
          <HowToRegIcon />
          <Typography>RSVP</Typography>
        </IconButton>
        <Typography sx={{marginLeft: 12}} variant='body2'>see comments</Typography>
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
          <EventCommentsList eventId={eventId} />
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default YcEventPoster;
