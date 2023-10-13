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
  const user = useSelector(state => state?.auth?.user);
  // const dispatch = useDispatch();
  // dispatch(clearState());
  console.log('member?.id ===', member?.id)
  if (member?.id !== undefined) {
    const {yachtClubByYachtClub: { id: ycId } } = member;
    router.push('/yachty', {query: { ycId }})
  }
  
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