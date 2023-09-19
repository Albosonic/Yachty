import styles from '@/styles/Home.module.css'
import NavBar from '@/components/NavBar';
import { Stack, Typography } from '@mui/material';

const Login = () => {
  return (
    <main >
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