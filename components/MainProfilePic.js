import { clearState } from "@/slices/actions/authActions";
import { Avatar, Fab, IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MainProfilePic = ({ size='small'}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const userIsCommodore = useSelector(state => state?.auth?.user?.userIsCommodore);
  const profilePic = useSelector(state => state.auth.member.profilePic);
  const memberId = useSelector(state => state.auth.member.id);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);  

  const handleClick = (event) => {    
    setAnchorEl(event.currentTarget);    
  };

  const handleClose = () => {
    setAnchorEl(null);
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
  const createRaces = () => {
    router.replace({pathname: '/yachty/create_races' })
  }
  const reciprocalRequests = () => {
    router.replace({pathname: '/yachty/reciprocal_requests', query: { ycId: ycId }})    
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar alt="Profile Pic" src={profilePic} />     
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
        {userIsCommodore && <MenuItem onClick={createRaces}>create races</MenuItem>}
        {userIsCommodore && <MenuItem onClick={editClubProfile}>edit club info</MenuItem> }
        <MenuItem onClick={createEvent}>create Event</MenuItem>
        <MenuItem onClick={memberApplicants}>member applicants</MenuItem> 
        <MenuItem onClick={editMyProfile}>edit my profile</MenuItem> 
        <MenuItem onClick={logout}>logout</MenuItem>        
      </Menu>
    </>
    
  )
}

export default MainProfilePic;