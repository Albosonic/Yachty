import CommodoreView from '@/components/commodore/CommodoreView';
import NavBar from '@/components/NavBar';
import styles from '@/styles/yachty.module.css'
import { useQuery } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { GET_YC_MEMBER } from './yachtygql';
import { addMember } from '@/slices/actions/authActions';
import YCMemberView from '@/components/YCMemberView';


const Yachty = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const dispatch = useDispatch();
  const { loading, error, data } = useQuery(
    GET_YC_MEMBER,
    {
      variables:{ 
        email: user?.email 
      }
    }
  );

  if (!user || loading) return <CircularProgress />
  if (data.yc_members.length === 0) router.push('/yc_regions');
  if (!data || error) router.push('/login');
    
  const memberData = data.yc_members[0];
    
  dispatch(addMember(memberData)); // stores member in redux.

  const userIsCommodore = memberData.id === memberData.yachtClubByYachtClub.commodore.id;
  console.log('memberData ====', userIsCommodore)
  return (
    <div>
      <NavBar />
      <div className={styles.center}>
        <div className={styles.titleSection}>
          {userIsCommodore ? (
            <CommodoreView />
          ): (
            <YCMemberView />
          )
        }
        </div>
      </div>
    </div>
  );
}

export default Yachty;
