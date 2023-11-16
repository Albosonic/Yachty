import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SailingIcon from '@mui/icons-material/Sailing';
import EditIcon from '@mui/icons-material/Edit';
import DirectionsBoatFilledIcon from '@mui/icons-material/DirectionsBoatFilled';
import BroadcastOnPersonalIcon from '@mui/icons-material/BroadcastOnPersonal';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AddHomeIcon from '@mui/icons-material/AddHome';
import ModeIcon from '@mui/icons-material/Mode';
import LogoutIcon from '@mui/icons-material/Logout';
import ChatIcon from '@mui/icons-material/Chat';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { clearState } from '@/slices/actions/authActions';
import { useMediaQuery } from '@mui/material';

export default function AppDrawer({ open, toggleDrawer }) {
  const router = useRouter();
  const dispatch = useDispatch()
  const ycId = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.id);
  const memberId = useSelector(state => state?.auth?.member?.id);
  const userIsCommodore = useSelector(state => state?.auth?.user?.userIsCommodore);
  const moreThan600px = useMediaQuery('(min-width:600px)');
  let anchor = 'left';

  const logout = () => {
    dispatch(clearState());
    window.location = `${window.location.origin}/api/auth/logout`;
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
    >
      <List>



        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty/edit_my_profile', query: { memberId }})}>
          <ListItemIcon>
            <EmojiPeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Edit My Profile" />
          </ListItemButton>
        </ListItem>


        {userIsCommodore && 
        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname: '/yachty/edit_club_profile', query: { ycId: ycId }})}>
            <ListItemIcon>
              <ModeIcon />
            </ListItemIcon>
            <ListItemText primary="Edit Club Profile" />
          </ListItemButton >
        </ListItem>}

        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty/view_all_members', query: { ycId: ycId }})}>
            <ListItemIcon>
              <PersonSearchIcon />
            </ListItemIcon>
            <ListItemText primary="View All Members" />
          </ListItemButton>
        </ListItem>


        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty/add_member', query: { ycId: ycId }})}>
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="New Member Applicants" />
          </ListItemButton>
        </ListItem>

        {userIsCommodore && 
        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname: '/yachty/create_yc_event', query: { ycId: ycId }})}>
            <ListItemIcon>
              <AddHomeIcon />
            </ListItemIcon>
            <ListItemText primary="Create Yacht Club Event" />
          </ListItemButton >
        </ListItem>}


        <ListItem disablePadding>
          <ListItemButton onClick={() => { router.replace({pathname:'/yachty/yc_feed', query: { ycId: ycId }})}}>
          <ListItemIcon>
              <BroadcastOnPersonalIcon />
          </ListItemIcon>
          <ListItemText primary="My Club" />
          </ListItemButton>
        </ListItem>


        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty', query: { ycId: ycId }})}>
          <ListItemIcon>
              <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>


        {userIsCommodore && 
        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname: '/yachty/create_races' })}>
            <ListItemIcon>
              <SailingIcon />
              </ListItemIcon>
            <ListItemText primary="Create Races" />
          </ListItemButton >
        </ListItem>}
        {<ListItem disablePadding>
        <ListItemButton onClick={() => router.replace({pathname: '/yachty/racing' })}>
          <ListItemIcon>
            <SailingIcon />
          </ListItemIcon>
          <ListItemText primary="Racing" />
          </ListItemButton >
        </ListItem>}


        


        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty/request_reciprocity', query: { memberId }})}>
          <ListItemIcon>
            <DirectionsBoatFilledIcon />
            </ListItemIcon>
            <ListItemText primary="Request Reciprocity" />
          </ListItemButton>
        </ListItem>

        

        

        
        {/* <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty/today_at_the_club', query: { ycId: ycId }})}>
            <ListItemIcon>
              <InsertInvitationIcon />
            </ListItemIcon>
            <ListItemText primary="Today at the Club" />
          </ListItemButton>
        </ListItem> */}
        {userIsCommodore && <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname: '/yachty/reciprocal_requests', query: { ycId: ycId }})}>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Reciprocal Requests" />
          </ListItemButton>
        </ListItem>}

        


        



        <ListItem disablePadding>
          <ListItemButton onClick={() => moreThan600px ? router.replace({pathname:'/yachty/direct_messages'}) : router.replace({pathname:'/yachty/mobile_dm_rooms'}) }>
            <ListItemIcon>
              <ChatIcon/>
            </ListItemIcon>
            <ListItemText primary="Direct Messages" />
          </ListItemButton>
        </ListItem>
        {/* <ListItem disablePadding>
          <ListItemButton onClick={() => console.log('build this route next')}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="All Clubs" />
          </ListItemButton>
        </ListItem> */}
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
        <React.Fragment key={anchor}>
          <Drawer
            anchor={anchor}
            open={open}
            onClose={toggleDrawer()}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
    </div>
  );
}