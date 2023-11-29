import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {  useQuery } from '@apollo/client';
import { CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { GET_ALL_MEMBER_APPLICANTS } from '@/lib/gqlQueries/addMemberGQL';
import NavBar from '@/components/NavBar';
import ApplicantsUnderReview from '@/components/ApplicantsUnderReview';
import LoadingYachty from '@/components/LoadingYachty';

const AddMember = () => {
  const router = useRouter();
  // TODO: move the data fetching into the component instead of here.
  const {data, loading, error, refetch} = useQuery(GET_ALL_MEMBER_APPLICANTS, { variables: { ycId: router.query.ycId } });
  if (loading) return <Grid container justifyContent="center"><LoadingYachty/></Grid>;
  if (error) router.push('/login');
  const { potential_members } = data;
  if (potential_members.length === 0) {
    return (
      <>
        <NavBar/>
        <Stack sx={{margin: 10}} alignItems="center">
          <Typography>There are no applicants at this time.</Typography>
        </Stack>
      </>
    )
  }  
  return (
    <>
      <NavBar />
      <Stack spacing={2} alignItems="center">
        <ApplicantsUnderReview applicants={potential_members} refetch={refetch} />
      </Stack>
    </>
  );
}

export default AddMember;