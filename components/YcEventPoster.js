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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, Stack, useMediaQuery } from '@mui/material';
import RaceCourseMenu from './RaceCourseMenu';
import RaceOptionsMenu from './RaceOptionsMenu';
import { useRouter } from 'next/router';
import RaceParticipants from './RaceParticipants';
import EventCommentsList from './EventcommentsList';

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

const YcEventPoster = ({ eventData }) => {
  
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const isCommodore = useSelector(state => state?.auth?.user?.userIsCommodore);
  const [openDialog, setOpenDialog] = useState(false);
  
  
  const burgee = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  // const member = useSelector(state => state.auth.member);
  // const profilePic = useSelector(state => state.auth.member.profilePic);
  
  
  const handleClose = () => {
    setShowSuccess(false)
  }
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  const shareClick = async () => {    
    const resp = await navigator.permissions.query({ name: "clipboard-write" });
    const origin = window.location.origin;
    const newClipResp = await navigator.clipboard.writeText(`${origin}/yachty/racer?memberId=${member.id}`).then(
      (what) => setShowSuccess(true),
      (the) => console.log("copy text failed"),
      );
    }
    
  const moreThan600px = useMediaQuery('(min-width:600px)');

  const goToReservations = () => router.push({pathname: '/yachty/yc_feed/purchase_event_ticket', query: {eventId}})
  
  const { image, event_name: eventName, location, hours, date, entertainment, specialNotes, id: eventId } = eventData;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          url copied to clipboard
        </Alert>
      </Snackbar>      
      <CardHeader
        avatar={<Avatar src={burgee} aria-label="burgee" />}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={eventName}
        subheader={hours}
      />
      <CardMedia
        component="img"
        height="194"
        image={image}
        alt="Event Image"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">put a brief race description here maybe</Typography>
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
          <Typography>Register</Typography>
        </IconButton>
        <Typography variant='body2'>see comments</Typography>
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






      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
            aside for 10 minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over
            medium-high heat. Add chicken, shrimp and chorizo, and cook, stirring
            occasionally until lightly browned, 6 to 8 minutes. Transfer shrimp to a
            large plate and set aside, leaving chicken and chorizo in the pan. Add
            pimentón, bay leaves, garlic, tomatoes, onion, salt and pepper, and cook,
            stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and
            peppers, and cook without stirring, until most of the liquid is absorbed,
            15 to 18 minutes. Reduce heat to medium-low, add reserved shrimp and
            mussels, tucking them down into the rice, and cook again without
            stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse> */}




//     </Card>
//   );
// }

// export default YcEventPoster;























// import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
// import { Box, Button, Grid, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
// import EventCommentsList from "./EventcommentsList";

// const YcEventPoster = ({ eventData }) => {
//   const router = useRouter();
//   const { image, event_name: eventName, location, hours, date, entertainment, specialNotes, id: eventId } = eventData;
//   const isCommodore = useSelector(state => state?.auth?.user?.userIsCommodore);
//   const moreThan600px = useMediaQuery('(min-width:600px)');

//   const posterWidth = moreThan600px ? 550 : 300;
//   return (
//     <>
//       <Paper sx={{padding: 5, maxWidth: 700, margin: '0 auto', marginBottom: 5, marginTop: 5 }} elevation={3}>
//         <Stack display="flex"
//           alignItems="center"
//           sx={{
//             margin: '0 auto',
//             border: '1px solid black',
//             minWidth: posterWidth,
//           }}
//         >
//           <Typography variant="h4" sx={{marginTop: 2}}>{ date }</Typography>
//           <Typography variant="h3" sx={{margin: 3}}>{ eventName }</Typography>
//           <Box
//             component="img"
//             sx={{
//               height: '100%',
//               width: '100%',
//               // maxWidth: 500,
//               padding: 5,
//             }}
//             alt="The house from the offer."
//             src={image}
//           />
//           <Box sx={{margin: 2}}></Box>
//           <Grid container justifyContent="space-around">
//             <Typography variant="h6">
//               Held at: { location }
//             </Typography>
//             <Typography variant="h6">
//               Hours: { hours }
//             </Typography>
//           </Grid>
//           <Stack sx={{margin: 2}} spacing={.5}>
//             <Typography>Featuring special guest: {entertainment}</Typography>
//             <Typography>SpecialNotes: { specialNotes }</Typography>
//           </Stack>
//           <Grid container justifyContent="space-around">
//             <Button onClick={() => router.push({pathname: '/yachty/yc_feed/purchase_event_ticket', query: {eventId}})}>RSVP</Button>
//             {isCommodore && <Button onClick={() => router.push({pathname: '/yachty/yc_feed/see_event_res', query: {eventId}})}>See Member RSVP</Button>}
//           </Grid>
//         </Stack>
//         <>
//           <Typography>
//             members attending: 70
//           </Typography>
//           <EventCommentsList eventId={eventId} />
//         </>
//       </Paper>
//     </>
//   )
// };

// export default YcEventPoster;