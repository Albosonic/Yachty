import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';

const EventOptionsMenu = ({}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonText, setButtonText] = useState('Choose Race Series');

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (series) => {
    setAnchorEl(null);    
  };

  const createSeries = () => {
    handleClose();    
  }
  // create all Members table Dialog. feed it members that are attending am 
  return (
    <>

      <IconButton aria-label="settings" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>          
      <Menu
        id="course-selector"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'course-select',
        }}
      >
        <MenuItem>Event Attendees</MenuItem>
      </Menu>
    </>
  );
}

export default EventOptionsMenu;