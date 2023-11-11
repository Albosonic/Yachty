import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const EventsListMenu = ({eventData, setEvent}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = (event) => {
    setAnchorEl(null);
    if (event?.id) setEvent(event);
  };
  
  console.log('Events ======', eventData)
  eventData.map(event => console.log('event :', event))
  return (
    <>
      <Button
        id="course-select-button"
        aria-controls={open ? 'race-course-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Choose Event
      </Button>
      <Menu
        id="course-selector"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'course-select',
        }}
      >
        {eventData.map((event, i) => <MenuItem key={event.event_name + i} onClick={() => handleClose(event)}>{event.event_name}</MenuItem>)}
      </Menu>
    </>
  );
}
export default EventsListMenu;