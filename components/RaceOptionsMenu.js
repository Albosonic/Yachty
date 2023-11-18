import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const RaceOptionsMenu = ({courses, setCourse, raceId}) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState(null);
  const userIsCommodore = useSelector(state => state.auth.user.userIsCommodore)

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
  };

  const goToRace = (event) => {
    router.push({
      pathname: '/yachty/racing/race',
      query: {raceId}
    })
  }

  const seeParticipants = (event) => {
    router.push({
      pathname: '/yachty/racing/race_participants',
      query: {raceId}
    })
  }

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
        MenuListProps={{'aria-labelledby': 'race-options'}}
      >
        {/* <MenuItem onClick={goToRace}>Go To Race</MenuItem> */}
        <MenuItem onClick={seeParticipants}>See Participants</MenuItem>
        {/* {userIsCommodore && <MenuItem onClick={handleClose}>See Course</MenuItem>} */}
        {/* {courses.map((course, i) => <MenuItem key={course.courseName + i} onClick={() => handleClose(course)}>{course.courseName}</MenuItem>)} */}
      </Menu>
    </>
  );
}

export default RaceOptionsMenu;