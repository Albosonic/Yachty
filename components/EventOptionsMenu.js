import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';
import EventAttendeeDialog from './EventAttendeesDialog';
import { useRouter } from 'next/router';

const EventOptionsMenu = ({ eventId }) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null)
  const [buttonText, setButtonText] = useState('Choose Race Series')
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
        <MenuItem onClick={() => router.replace({pathname:'/yachty/seating', query: { eventId }})} >Event Seating</MenuItem>
      </Menu>
    </>
  );
}

export default EventOptionsMenu;