import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import { Stack, Typography } from '@mui/material';
import styles from '@/styles/Home.module.css'
import { useUser } from '@auth0/nextjs-auth0/client';
import { clearState } from '@/slices/actions/authActions';

const Login = () => {
  const router = useRouter()
  const member = useSelector(state => state?.auth?.member);
  
  const {user} = useUser();
  const dispatch = useDispatch();
  // if (!user) dispatch(clearState())

  if (member) {
    const {yachtClubByYachtClub: { id: ycId } } = member;
    router.push('/yachty', {query: { ycId }})
  }
  // member dat is stuck in redux even though the user is not logged in
  
  return (
    <main>
      <NavBar />
      <div className={styles.center} >
        <Stack spacing={2} alignItems="center">
          <Typography variant='h1'>Yachty</Typography>
        </Stack>
      </div>
    </main>
  );
}

export default Login;