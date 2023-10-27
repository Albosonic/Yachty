import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { CircularProgress, Grid, Stack } from '@mui/material';
import NavBar from '@/components/NavBar';
import {  useQuery } from '@apollo/client';
import ApplicantsUnderReview from '@/components/ApplicantsUnderReview';
import { GET_ALL_MEMBER_APPLICANTS } from '@/lib/gqlQueries/addMemberGQL';

const AddMember = () => {
  const router = useRouter();
  // TODO: move the data fetching into the component instead of here.
  const {data, loading, error, refetch} = useQuery(GET_ALL_MEMBER_APPLICANTS, { variables: { ycId: router.query.ycId } });
  if (loading) return <Grid container justifyContent="center"><CircularProgress/></Grid>
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