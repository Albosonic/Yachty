import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Fab } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const RaceOptionsMenu = ({courses, setCourse}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (course) => {
    setAnchorEl(null);
    if (course?.id) setCourse(course);
  };

  return (
    <>
      <Fab onClick={handleClick}>
        <ExpandMoreIcon />
      </Fab>        
        choose a course
      <Menu
        id="course-selector"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'course-select',
        }}
      >
        <MenuItem>sup!!</MenuItem>
        {/* {courses.map((course, i) => <MenuItem key={course.courseName + i} onClick={() => handleClose(course)}>{course.courseName}</MenuItem>)} */}
      </Menu>
    </>
  );
}

export default RaceOptionsMenu;