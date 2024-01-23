import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';
import { clearState } from "@/slices/actions/authActions";
import { demoEditProfileOptionAct } from "@/slices/actions/uxActions";

const MainProfilePic = () => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const anchorRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const demoEditProfileOption = useSelector(state => state.ux.demo.editPofileOption);
  const userIsCommodore = useSelector(state => state?.auth?.user?.userIsCommodore);
  const profilePic = useSelector(state => state.auth.member.profilePic);
  const memberId = useSelector(state => state.auth.member.id);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);

  useEffect(() => {
    if (demoEditProfileOption) {      
      setAnchorEl(anchorRef.current);
    }
  }, [demoEditProfileOption])
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    dispatch(demoEditProfileOptionAct(false))
  }

  const logout = () => {
    dispatch(clearState());
    window.location = `${window.location.origin}/api/auth/logout`;
  };

  const editMyProfile = () => {
    router.replace({
      pathname:'/yachty/edit_my_profile',
      query: { memberId }
    })
  };

  const editClubProfile = () => {
    router.replace({pathname: '/yachty/edit_club_profile', query: { ycId: ycId }})
  }
  const memberApplicants = () => {
    router.replace({pathname:'/yachty/add_member', query: { ycId: ycId }})
  }
  const createEvent = () => {
    router.replace({pathname: '/yachty/create_yc_event', query: { ycId: ycId }})
  }
  const makeNewEvent = () => {
    router.replace({pathname: '/yachty/make_new_event' })
  }
  const makeNewRace = () => {
    router.replace({pathname: '/yachty/make_new_race' })
  }
  const reciprocalRequests = () => {
    router.replace({pathname: '/yachty/reciprocal_requests', query: { ycId: ycId }})
  }

  const editProfileStyles = demoEditProfileOption ? {backgroundColor: theme.custom.demoBackgroundColor} : {};

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar alt="Profile Pic" src={profilePic} sx={{width: 50, height: 50}} />
        <CircleIcon 
          color="error"
          sx={{
            fontSize: 14,
            marginBottom: 4,            

          }} 
        />          
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
        {userIsCommodore && <MenuItem onClick={reciprocalRequests}>reciprocal requests</MenuItem>}        
        {userIsCommodore && <MenuItem onClick={makeNewRace}>create race</MenuItem>}
        {userIsCommodore && <MenuItem onClick={makeNewEvent}>create event</MenuItem>}
        {userIsCommodore && <MenuItem onClick={editClubProfile}>edit club info</MenuItem>}
        <MenuItem onClick={memberApplicants}>member applicants</MenuItem>        
        <MenuItem sx={editProfileStyles} onClick={editMyProfile}>edit my profile</MenuItem>        
        <MenuItem onClick={logout}>logout</MenuItem>
      </Menu>
    </>

  )
}

export default MainProfilePic;