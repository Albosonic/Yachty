import { Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import NavBar from '@/components/NavBar';
import styles from '@/styles/addMember.module.css'

import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import ApplicantsUnderReview from '@/components/ApplicantsUnderReview';
import { GET_ALL_MEMBER_APPLICANTS } from './addMemberGQL';


const AddMember = () => {
  const router = useRouter();
  // TODO: move the data fetching into the component instead of here.
  const {data, loading, error, refetch} = useQuery(GET_ALL_MEMBER_APPLICANTS, { variables: { ycId: router.query.ycId } });
  if (loading) return <div className={styles.center}><CircularProgress /></div>
  if (error) router.push('/login');
  
  const { potential_members } = data;
  return (
    <div>
      <NavBar />
      <Stack spacing={2} alignItems="center">
        <ApplicantsUnderReview applicants={potential_members} refetch={refetch} />
      </Stack>
    </div>
  );
}

export default AddMember;