import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import { Box, Button, CircularProgress, Container, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import styles from '@/styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0/client';
import AnchorIcon from '@mui/icons-material/Anchor';
import { clearState } from '@/slices/actions/authActions';

const Login = () => {
  const router = useRouter()
  const ycId = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.id);
  const memberId = useSelector(state => state?.auth?.member?.id);
  const {user, isLoading} = useUser();

  // dispatch(clearState()) //for debugging purposes.
  const moreThan600px = useMediaQuery('(min-width:600px)');

  if (isLoading) return <CircularProgress />
  if (user?.email_verified === true) router.push('/yachty', {query: { ycId }});

  const waterLevel = moreThan600px ? "19%" : "29%";
// https://yachty-letter-heads.s3.us-west-1.amazonaws.com/a2bb7f71-7b84-4db7-b9cb-306bf54a5af7
  return (
    <main style={{backgroundColor: '#052745', minHeight: '100vh'}}>
      <Stack
        spacing={6}
        alignItems="center"
      >
        <AnchorIcon sx={{fontSize: 200}} />
        <Button variant='standard' color="secondary" onClick={() => window.location = `${window.location.origin}/api/auth/login`}>Log in to Yachty</Button>
      </Stack>
    </main>
  );
}

export default Login;