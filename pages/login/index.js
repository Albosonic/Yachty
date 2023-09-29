import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import NavBar from '@/components/NavBar';
import { Stack, Typography } from '@mui/material';
import styles from '@/styles/Home.module.css'

const Login = () => {
  const router = useRouter()
  const member = useSelector(state => state?.auth?.member);
  const {yachtClubByYachtClub: { id: ycId } } = member;

  if (member) router.push('/yachty', {query: { ycId }})
  
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