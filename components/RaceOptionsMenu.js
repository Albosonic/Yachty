import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReleaseFormDialog from './ReleaseFormDialog';
import CommentsFromTheChairDialog from './CommentsFromChairDialog';

const RaceOptionsMenu = ({ raceId, releaseFormId, goToReservations }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReleaseDialog, setOpenReleaseDialog] = useState(false);
  const [chairCommentsOpen, setChairCommentsOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
  };

  // const goToRace = (event) => {
  //   router.push({
  //     pathname: '/yachty/racing/race',
  //     query: {raceId}
  //   })
  // }

  const openDialogAndCloseMenu = () => {
    handleClose();
    setOpenReleaseDialog(true)
  }

  const openCommentsFromChairDialog = () => {
    handleClose();
    setChairCommentsOpen(true);
  }

  return (
    <>
      <ReleaseFormDialog 
        setOpenDialog={setOpenReleaseDialog} 
        open={openReleaseDialog} 
        releaseFormId={releaseFormId}
      />
      <CommentsFromTheChairDialog 
        setOpenDialog={setChairCommentsOpen} 
        open={chairCommentsOpen}
        raceId={raceId}
      />
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
        <MenuItem onClick={goToReservations}>Register for Race</MenuItem>
        <MenuItem onClick={openDialogAndCloseMenu}>Release Form</MenuItem>
        <MenuItem onClick={openCommentsFromChairDialog}>Race Summary</MenuItem>
        {/* {userIsCommodore && <MenuItem onClick={handleClose}>See Course</MenuItem>} */}
        {/* {courses.map((course, i) => <MenuItem key={course.courseName + i} onClick={() => handleClose(course)}>{course.courseName}</MenuItem>)} */}
      </Menu>
    </>
  );
}

export default RaceOptionsMenu;