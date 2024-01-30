import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReleaseFormDialog from './ReleaseFormDialog';
import CommentsFromTheChairDialog from './CommentsFromChairDialog';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const RaceOptionsMenu = ({ raceId, releaseFormId, goToReservations }) => {  
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openReleaseDialog, setOpenReleaseDialog] = useState(false);
  const [chairCommentsOpen, setChairCommentsOpen] = useState(false);
  const userIsCommodore = useSelector(state => state.auth.user.userIsCommodore);  

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

  const editRace = (event) => {
    // TODO: dispatch working race here...
    
    router.push({
      pathname: '/yachty/racing/make_new_race',
      query: {editing: true}
    })
  }

  const openDialogAndCloseMenu = () => {
    handleClose()
    setOpenReleaseDialog(true)
  }

  const openCommentsFromChairDialog = () => {
    handleClose()
    setChairCommentsOpen(true)
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
        <MenuItem onClick={goToRace}>Go To Race</MenuItem>
        <MenuItem onClick={editRace}>Edit Race</MenuItem>
        {/* {userIsCommodore && <MenuItem onClick={handleClose}>See Course</MenuItem>} */}
        {/* {courses.map((course, i) => <MenuItem key={course.courseName + i} onClick={() => handleClose(course)}>{course.courseName}</MenuItem>)} */}
      </Menu>
    </>
  );
}

export default RaceOptionsMenu;



// Design and Build internal tools, for large enterprise scale and support teams that need help with React bugs and features. Deploy code through CI/CD pipelines. Debug deploys in AWS. 

// Develop Web application in React, grapghQL, Postgress, to communicate with a VR headset for use in the Medical device industry. Small Agile team of 3 engineers. Build and maintain full-stack end to end features with a high degree of security, utilizing an agile methodology to organize tasks and bugs.

// Maintain large enterprise e-commerce software application utilizing agile methodology for fast iteration and efficient use of time and visibility. Partnering with product design and QA

// Extend existing Software application with new features to meet business goals and contractual obligations. Utilize agile methodologies for streamlined workflow and organization of tasks and bugs. Work closely with design and QA.