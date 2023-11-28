import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const RaceCourseMenu = ({courses, setCourse}) => {
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
      <Button
        id="course-select-button"
        aria-controls={open ? 'race-course-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"        
        endIcon={<ArrowDropDownIcon />}        
        sx={{minWidth: 223}}
      >
        choose a course
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
        {courses.map((course, i) => <MenuItem key={course.courseName + i} onClick={() => handleClose(course)}>{course.courseName}</MenuItem>)}
      </Menu>
    </>
  );
}

export default RaceCourseMenu;