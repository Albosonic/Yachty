import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import BugReportIcon from '@mui/icons-material/BugReport';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Avatar, Fab } from '@mui/material';
import AppDrawer from './Drawer';
import { useSelector } from 'react-redux';

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const profilePicture = useSelector(state => state.auth.member?.profilePic);
  const emailVerrified = useSelector(state => state.auth?.user?.email_verified);

  useEffect(() => {
    setUserLoggedIn(emailVerrified);
  }, [emailVerrified]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenDrawer(!openDrawer);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar >
          {emailVerrified && <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer()}
          >
            <MenuIcon />
            <AppDrawer open={openDrawer} toggleDrawer={toggleDrawer} />
          </IconButton>}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Yachty
          </Typography>
          <Fab size='small' variant="extended" sx={{marginRight: 3}}>
            <BugReportIcon/>
            Test
          </Fab>
          {userLoggedIn && (
            <Fab size='small'>
              <Avatar alt="Profile Pic" src={profilePicture} />
            </Fab>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
