import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import BugReportIcon from '@mui/icons-material/BugReport';
import { Fab } from '@mui/material';
import AppDrawer from './Drawer';
import { useSelector } from 'react-redux';
import MainProfilePic from './MainProfilePic';
import { useTheme } from '@emotion/react';

export default function NavBar() {  
  const theme = useTheme();  
  const [openDrawer, setOpenDrawer] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const emailVerrified = useSelector(state => state.auth?.user?.email_verified);
  const email = useSelector(state => state.auth?.user?.email);
  
  useEffect(() => {    
    setUserLoggedIn(!!email || emailVerrified);
  }, [emailVerrified, email]);

  const toggleDrawer = () => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpenDrawer(!openDrawer);
  };

  return (
    <Box sx={{ flexGrow: 1, borderBottom:`8px solid ${theme.custom.trimColor}`}}>
      <AppBar position="static">
        <Toolbar >
          {
          userLoggedIn && 
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer()}
          >
            <MenuIcon />
            <AppDrawer open={openDrawer} toggleDrawer={toggleDrawer} />
          </IconButton>
          }
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Yachty
          </Typography>
          <Fab size='small' variant="extended" sx={{marginRight: 3}}>
            <BugReportIcon/>
            Test
          </Fab>
          <MainProfilePic 
            size="small" 
            loggedIn={userLoggedIn}            
          />          
        </Toolbar>
      </AppBar>
    </Box>
  );
}
