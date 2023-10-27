import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Avatar, CircularProgress } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import AppDrawer from './Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { clearState } from '@/slices/actions/authActions';

export default function NavBar() {
  const { user, isLoading } = useUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const auth = useSelector(state => state?.auth);
  const profilePicture = useSelector(state => state.auth.member?.profilePic);
  const emailVerrified = useSelector(state => state.auth?.user?.email_verified);
  
  useEffect(() => {
    setUserLoggedIn(auth?.email_verified || user?.email_verified);
  }, [auth]);

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
          {userLoggedIn && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar alt="Profile Pic" src={profilePicture} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
