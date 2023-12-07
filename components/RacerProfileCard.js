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
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

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

const RacerProfileCard = ({ racer }) => {  
  
  const [expanded, setExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);  

  const handleClose = () => {
    setShowSuccess(false)
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const shareClick = async () => {    
    const resp = await navigator.permissions.query({ name: "clipboard-write" });
    console.log(resp.state);
    const origin = window.location.origin;
    const newClipResp = await navigator.clipboard.writeText(`${origin}/yachty/racer?memberId=${racer.id}`).then(
      (what) => setShowSuccess(true),
      (the) => console.log("copy text failed"),
    );
  }
  
  const firstName = racer?.firstName
  const lastName = racer?.lastName
  const profilePic = racer?.profilePic
  const bio = racer?.bio  
  const vessel = racer?.vessels[0]
  
  return (
    <Card sx={{ maxWidth: 345 }}>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          url copied to clipboard
        </Alert>
      </Snackbar>
      <CardHeader
        avatar={<Avatar src={profilePic} aria-label="racer-img" />}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={`${firstName} ${lastName}`}
        subheader={vessel?.vesselName || 'unknown'}
      />
      <CardMedia
        component="img"
        height="194"
        image={vessel?.img || "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/db10f677-4c20-49dc-95eb-88d3ff3aae8c"}
        alt="vessel photo"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">{bio}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton> */}
        <IconButton onClick={shareClick} aria-label="share">
          <ShareIcon />
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
          <Typography paragraph>Boat Details:</Typography>
          <Typography paragraph>
            Boat Details Here
          </Typography>
          {/* <Typography paragraph>
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
          </Typography> */}
          {/* <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography> */}
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default RacerProfileCard;
