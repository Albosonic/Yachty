import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import { Box, Button, CircularProgress, Container, Grid, Stack, Typography } from '@mui/material';
import styles from '@/styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0/client';
import { clearState } from '@/slices/actions/authActions';

const Login = () => {
  const router = useRouter()
  const ycId = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.id);
  const memberId = useSelector(state => state?.auth?.member?.id);
  const {user, isLoading} = useUser();

  // dispatch(clearState()) //for debugging purposes.

  if (isLoading) return <CircularProgress />
  if (user?.email_verified === true) router.push('/yachty', {query: { ycId }});

  return (
    <main>
      <NavBar />
      <div className={styles.center} >
        <Stack spacing={4} alignItems="center">
          <Typography variant='h2'>Yachty</Typography>
          <Button onClick={() => window.location = `${window.location.origin}/api/auth/login`}>
            Log in to Yachty
          </Button>
          
            <Box
              component="img"
              sx={{
                height: '100%',
                width: '100%',
              }}
              alt="Yachty Logo"
              src="https://yachty-letter-heads.s3.us-west-1.amazonaws.com/3775947f-3ada-47d6-8f78-f48e5c099e40"
            />
          <Grid 
            sx={{
              backgroundColor: 'lightblue',
              borderRadius: '900px 190px 0px 0px',              
              width: 500,
              height: 255,
              position: 'fixed',
              opacity: .9,
              bottom: 0,
              margin: '0 auto',
            }}>
          </Grid>
        </Stack>
      </div>
    </main>
  );
}

export default Login;