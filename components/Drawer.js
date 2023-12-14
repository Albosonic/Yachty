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
import DirectionsBoatFilledIcon from '@mui/icons-material/DirectionsBoatFilled';
import BroadcastOnPersonalIcon from '@mui/icons-material/BroadcastOnPersonal';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ChatIcon from '@mui/icons-material/Chat';
import CircleIcon from '@mui/icons-material/Circle';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Divider, Grid, useMediaQuery } from '@mui/material';

export default function AppDrawer({ open, toggleDrawer }) {
  const router = useRouter();  
  const ycId = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.id);
  const memberId = useSelector(state => state?.auth?.member?.id);
  const moreThan600px = useMediaQuery('(min-width:600px)');
  let anchor = 'left';
  const itemStyles = {minHeight: 70}

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
    >
      <List>
      <ListItem sx={itemStyles} disablePadding>
        <ListItemButton onClick={() => router.replace({pathname:'/yachty', query: { ycId: ycId }})}>
        <ListItemIcon>
            <HomeIcon color="primary" />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem sx={itemStyles} disablePadding>
          <ListItemButton onClick={() => { router.replace({pathname:'/yachty/yc_feed', query: { ycId: ycId }})}}>
          <ListItemIcon>
              <BroadcastOnPersonalIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="The Club" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem sx={itemStyles} disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty/view_all_members', query: { ycId: ycId }})}>
            <ListItemIcon>
              <PersonSearchIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Members" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem sx={itemStyles} disablePadding>
          <ListItemButton onClick={() => router.replace({pathname: '/yachty/racing' })}>
            <ListItemIcon>
              <SailingIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Racing" />
          </ListItemButton >
        </ListItem>
        <Divider />
        {/* TODO: this is stupid!!!!!!! mover responsive behavior to one component. */}
        <ListItem sx={itemStyles} disablePadding>
          <ListItemButton onClick={() => moreThan600px ? router.replace({pathname:'/yachty/direct_messages'}) : router.replace({pathname:'/yachty/mobile_dm_rooms'}) }>
              <ListItemIcon>
                <Grid justifyContent="center">
                  <ChatIcon color="primary"/>
                  <CircleIcon 
                    color="error"
                    sx={{
                      fontSize: 14,
                      marginBottom: 2,
                      marginLeft: -1,

                    }} 
                  />                  
                </Grid>
              </ListItemIcon>
            <ListItemText primary="Direct Messages" />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem sx={itemStyles} disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty/request_reciprocity', query: { memberId }})}>
          <ListItemIcon>
            <DirectionsBoatFilledIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Request Reciprocity" />
          </ListItemButton>
        </ListItem>
        <Divider />

        {/* <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty/add_member', query: { ycId: ycId }})}>
            <ListItemIcon>
              <PersonAddIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="New Member Applicants" />
          </ListItemButton>
        </ListItem>
        {userIsCommodore && 
        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname: '/yachty/create_yc_event', query: { ycId: ycId }})}>
            <ListItemIcon>
              <AddHomeIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Create Yacht Club Event" />
          </ListItemButton >
        </ListItem>}  
        {userIsCommodore && 
        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname: '/yachty/create_races' })}>
            <ListItemIcon>
              <SailingIcon color="primary" />
              </ListItemIcon>
            <ListItemText primary="Create Races" />
          </ListItemButton >
        </ListItem>}
        {userIsCommodore && <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname: '/yachty/reciprocal_requests', query: { ycId: ycId }})}>
            <ListItemIcon>
              <GroupsIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Reciprocal Requests" />
          </ListItemButton>
        </ListItem>}                    
        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty/today_at_the_club', query: { ycId: ycId }})}>
            <ListItemIcon>
              <InsertInvitationIcon />
            </ListItemIcon>
            <ListItemText primary="Today at the Club" />
          </ListItemButton>
        </ListItem>        
        <ListItem disablePadding>
          <ListItemButton onClick={() => console.log('build this route next')}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="All Clubs" />
          </ListItemButton>
        </ListItem> */}



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