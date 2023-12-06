import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import EventAttendeeDialog from './EventAttendeesDialog';

const EventOptionsMenu = ({ eventId }) => {
  const [anchorEl, setAnchorEl] = useState(null);  
  const [buttonText, setButtonText] = useState('Choose Race Series');
  const [attendeesOpen, setAttendeesOpen] = useState(false)

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (series) => {
    setAnchorEl(null);    
  };

  const openAttendeesDialog = () => {
    setAttendeesOpen(true);
    setAnchorEl(null);
  }
    
  return (
    <>
      <EventAttendeeDialog open={attendeesOpen} setOpenDialog={setAttendeesOpen} eventId={eventId}/>
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
        <MenuItem onClick={openAttendeesDialog} >Event Attendees</MenuItem>
      </Menu>
    </>
  );
}

export default EventOptionsMenu;