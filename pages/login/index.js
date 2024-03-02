import { useDispatch, useSelector } from 'react-redux';
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
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
  const { data: user } = useSession()
  console.log('user =========>', user)

  // dispatch(clearState()) //for debugging purposes.
  const moreThan600px = useMediaQuery('(min-width:600px)');

  // if (isLoading ) return <LoadingYachty />
  // if (user?.email_verified === true) router.push('/yachty', {query: { ycId }});


// https://yachty-letter-heads.s3.us-west-1.amazonaws.com/a2bb7f71-7b84-4db7-b9cb-306bf54a5af7

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
        // flexGrow={1}
        // sx={{ minHeight: '100vh' }}
      >
        <AuthButton />
        <AnchorIcon
          sx={{
            fontSize: 350,
            color: '#c9c5c5',
          }}
        />
      </Grid>
      <Button
        onClick={() => window.location = `${window.location.origin}/api/auth/login`}
        sx={{
          color: '#FFFFFF',
          fontFamily: 'Bradley Hand, cursive',
          fontSize: 40,
          position: 'absolute',
          bottom: 10
        }}>
          Join The Club
      </Button>
    </Stack>
  );
}

export default Login;