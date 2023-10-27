import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import styles from '@/styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0/client';
import { clearState } from '@/slices/actions/authActions';

const Login = () => {
  const router = useRouter()
  const ycId = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.id);
  const memberId = useSelector(state => state?.auth?.member?.id);
  const {user, isLoading} = useUser()

  if (isLoading) return <CircularProgress />
  if (memberId !== undefined) router.push('/yachty', {query: { ycId }});
  
  return (
    <main>
      <NavBar />
      <div className={styles.center} >
        <Stack spacing={4} alignItems="center">
          <Typography variant='h1'>Yachty</Typography>
          <Box
            component="img"
            sx={{
              height: '100%',
              width: '100%',
            }}
            alt="The house from the offer."
            src="https://yachty-letter-heads.s3.us-west-1.amazonaws.com/3775947f-3ada-47d6-8f78-f48e5c099e40 "
          />
          <Button onClick={() => window.location = `${window.location.origin}/api/auth/login`}>
            Log in to Yachty
          </Button>
        </Stack>
      </div>
    </main>
  );
}

export default Login;