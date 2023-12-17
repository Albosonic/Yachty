import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
      primary: {
        main: '#052745',
        
      },
      secondary: {
        main: '#052745'
      }
    },
    custom: {
      trimColor: '#461F00',
      backgroundColor: '#052745',
      demoBackgroundColor: 'rgba(102, 153, 153, 0.3)',
      loginTextColor: '#FFFFFF',
    }    
  });

  // theme:
  //   components: {
  //     MuiListItemButton: {
  //       defaultProps: {
  //         disableTouchRipple: true,
  //       },
  //     },
  //   },
  //   palette: {
  //     mode: 'dark',
  //     primary: { main: 'rgb(102, 157, 246)' },
  //     background: { paper: 'rgb(5, 30, 52)' },
  //   },
  