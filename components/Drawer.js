import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import HomeIcon from '@mui/icons-material/Home';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

export default function AppDrawer({ open, toggleDrawer }) {
  const router = useRouter();
  const userIsCommodore = useSelector(state => state?.auth?.userIsCommodore);
  const ycId = useSelector(state => state?.auth?.ycId);
  let anchor = 'left';
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
    >
      <List>
        {userIsCommodore && <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname: '/yachty/reciprocal_requests', query: { ycId: ycId }})}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Reciprocal Requests" />
          </ListItemButton>
        </ListItem>}
        <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname:'/yachty/add_member', query: { ycId: ycId }})}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="New Member Applicants" />
          </ListItemButton>
        </ListItem>
        {userIsCommodore && <ListItem disablePadding>
          <ListItemButton onClick={() => router.replace({pathname: '/yachty/edit_club_profile', query: { ycId: ycId }})}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Edit Club Profile" />
          </ListItemButton >
        </ListItem>}
        <ListItem disablePadding>
          <ListItemButton onClick={() => {
            router.replace({pathname:'/yachty', query: { ycId: ycId }})
          }}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
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