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
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, Stack } from '@mui/material';
import RaceCourseMenu from './RaceCourseMenu';
import RaceOptionsMenu from './RaceOptionsMenu';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const burgee = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const member = useSelector(state => state.auth.member);
  const profilePic = useSelector(state => state.auth.member.profilePic);
  const vessel = useSelector(state => state.auth.member.vessels[0]);

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

  const bio = shareData?.bio || member?.bio;
  
  const { raceName, startDate, startTime, img, id: raceId, eventId } = race;

  const goToReservations = () => {
    router.push({
      pathname: '/yachty/racing/reservations',
      query: {raceId, eventId}
    })
  }
  
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          url copied to clipboard
        </Alert>
      </Snackbar>


      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogContent>


          <Grid container justifyContent="space-between">
            <DialogTitle>Register for Race</DialogTitle>
            <Avatar alt="Profile Pic" src={profilePic} />
          </Grid>


          <DialogContentText> vesse name: {vessel?.vesselName} </DialogContentText>
          <DialogContentText> hullMaterial: {vessel?.hullMaterial} </DialogContentText>
          <DialogContentText>length: {vessel?.length}</DialogContentText>


          <Grid container>
            <Stack alignItems="center">
              <Typography>
                Vessel: {vessel?.vesselName}
              </Typography>
              <Box
                component="img"
                sx={{
                  height: 200,
                  width: 200,
                  marginBottom: 2,
                }}
                alt="The house from the offer."
                src={vessel?.img} 
              />
            </Stack>
            <Stack sx={{marginTop: 5, marginLeft: 2}}>
              <Typography>
                hullMaterial: {vessel?.type}
              </Typography>
              <Typography>
                length: {vessel?.length}
              </Typography>
            </Stack>
          </Grid>
          <Grid container justifyContent="space-between" >
            <DialogActions>
              <Button onClick={handleClose}>go back</Button>
            </DialogActions>
            
            <DialogActions>
              <Button onClick={() => console.log('close')}>close</Button>
            </DialogActions>
            {/* <DialogActions>
              <Button color="success" onClick={() => handlePayment(memberEmail)}>Dues Paid</Button>
            </DialogActions> */}
          </Grid>
        </DialogContent>
      </Dialog>

      <CardHeader
        avatar={<Avatar src={burgee} aria-label="burgee" />}
        action={<RaceOptionsMenu raceId={raceId} />}
        title={raceName}
        subheader={`${startDate} ${startTime}`}
      />
      <CardMedia
        component="img"
        height="194"
        image={img}
        alt="Paella dish"
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
      </CardActions>
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Boat Details:</Typography>
          <Typography paragraph>
            Boat Details Here
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
    </Card>
  );
}

export default RacePoster;
