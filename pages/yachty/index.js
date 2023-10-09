import CommodoreView from '@/components/commodore/CommodoreView';
import NavBar from '@/components/NavBar';
import styles from '@/styles/yachty.module.css'
import { useQuery } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { CircularProgress, Typography } from '@mui/material';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { GET_YC_MEMBER } from './yachtygql';
import { addMember, addNewMemberApplication, addNonMember } from '@/slices/actions/authActions';
import { useEffect } from 'react';

const Yachty = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const dispatch = useDispatch();
  
  const { loading, error, data, refetch } = useQuery(
    GET_YC_MEMBER,
    {
      fetchPolicy: "no-cache",
      variables:{ 
        email: user?.email 
      }
    }
  );
  let memberData = data?.yc_members[0];
  console.log('memberData ===', memberData)
  const logo = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.logo);
  const userIsCommodore = useSelector(state => state?.auth?.userIsCommodore);

  useEffect(() => {
    if (memberData) {
      dispatch(addMember(memberData));
    }
  }, [memberData, logo])
  
  if (!user || loading || isLoading || !data) return <CircularProgress />
  if (data.yc_members.length === 0) {
    dispatch(addNonMember(user))
    router.push('/yc_regions');
    return null;
  }
  if (!data || error) router.push('/login');

  const welcomText = userIsCommodore ? `Welcome Comodore ${memberData.firstName}` : `Welcome ${memberData.firstName}`;
  return (
    <div>
      <NavBar refetch={refetch} />
      <div className={styles.center}>
        <div className={styles.titleSection}>
          <Typography variant="h2">{welcomText}</Typography>
        </div>
          {logo && <img src={logo} />}
      </div>
    </div>
  );
}

export default Yachty;
