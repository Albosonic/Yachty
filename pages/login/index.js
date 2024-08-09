import { useDispatch, useSelector } from 'react-redux';
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { Box, Button, CircularProgress, Container, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import styles from '@/styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0/client';
import AnchorIcon from '@mui/icons-material/Anchor';
import { clearState } from '@/slices/actions/authActions';
import LoadingYachty from '@/components/LoadingYachty';
import { useTheme } from '@emotion/react';
import AuthButton from '@/components/auth-components/SignInButton';

const Login = () => {
  const router = useRouter()
  const theme = useTheme()
  const ycId = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.id);
  const memberId = useSelector(state => state?.auth?.member?.id);
  // const {user, isLoading} = useUser();
  const { data: user, status } = useSession()
  if(status === "authenticated") router.replace({pathname: '/yachty'})
  const moreThan600px = useMediaQuery('(min-width:600px)');

  return (
    <Stack
      spacing={2}
      xs={3}
      sx={{
        height: '100vh',
        backgroundColor: theme.custom.backgroundColor,
        borderTop: `10px solid ${theme.custom.trimColor}`,
        borderBottom: `10px solid ${theme.custom.trimColor}`,
        overflow: "hidden",
        overflowY: "scroll",
        // border: '10px solid #461F00',
      }}
      alignItems="center"
    >
      <Typography
        sx={{
          color: theme.custom.loginTextColor,
          fontFamily: 'Bradley Hand',
          fontSize: 80,
          margin: 2,
        }}>
          Yachty
        </Typography>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <AuthButton />
        <AnchorIcon
          sx={{
            fontSize: 350,
            color: '#c9c5c5',
          }}
        />
      </Grid>
    </Stack>
  );
}

export default Login;