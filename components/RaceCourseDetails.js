import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const RaceCourseDetails = ({ course }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const { instructions } = course;
  return (
    <>
      <Button
        id="course-details-button"
        aria-controls={open ? 'race-course-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
      >
        See Course Details
      </Button>
      <Menu
        id="course-details"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'course-details',
        }}
      >
        {instructions.map((instruction, i) => {
          const { marker, side } = instruction;
          return <MenuItem key={instruction + i} onClick={handleClose}>{`${i + 1}. ${marker} ${side}`}</MenuItem>
        })}
      </Menu>
    </>
  );
}

export default RaceCourseDetails;