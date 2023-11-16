import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import styles from '@/styles/yachty.module.css'
import { gql, useMutation, useQuery } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { addMember, addNonMember, betaUpdateUserIsCommodoreAct } from '@/slices/actions/authActions';
import { GET_YC_MEMBER } from '@/lib/gqlQueries/yachtygql';
import { getIsoDate } from '@/lib/utils/getters';
import SailingIcon from '@mui/icons-material/Sailing';

const UPSERT_MEMBER = gql`
  mutation upsertMember(
    $email: String,
    $firstName: String,
    $lastName: String,
    $name: String,
    $profilePic: String,
    $lastLogin: date,
    $yachtClub: uuid!,
  ) {
  insert_yc_members(objects: {
    email: $email,
    firstName: $firstName,
    lastName: $lastName,
    name: $name,
    profilePic: $profilePic,
    yacht_club: $yachtClub,
  }, on_conflict: {
    constraint: yc_members_email_key,
    update_columns: lastLogin
  }) {
    returning {
      firstName
      lastName
      name
      email
      isRacer
      id
      bio
      active
      duesOwed
      profilePic
      vessels {
        vesselName
        vesselImage
        unafilliatedVesselId
        type
        specialNotes
        ownerId
        length
        insuranceInfo
        img
        id
        hullMaterial
        draft
        beam
      }
      yachtClubByYachtClub {
        id
        logo
        name
        region
        commodore {
          member_id
          name
          id
        }
      }
    }
  }
}`;

const BETA_GIVE_COMMODORE_STATUS = gql`
mutation insertCommodore($name: String!, $ycId: uuid!, $memberId: uuid!) {
  insert_commodores(objects: {name: $name, yacht_club: $ycId, member_id: $memberId}) {
    returning {
      active
      id
      member_id
      name
      yacht_club
      yachtClubByYachtClub {
        name
      }
    }
  }
}`;


const Yachty = () => {
  // const router = useRouter();
  const { user, isLoading } = useUser();
  const dispatch = useDispatch();
  const [upsertMember, {loading: upsertMemberLoading}] = useMutation(UPSERT_MEMBER)
  const [betaGiveCommodoreStatus, {loading: betaLoading}] = useMutation(BETA_GIVE_COMMODORE_STATUS)

  // const { loading, error, data, refetch } = useQuery(GET_YC_MEMBER,{fetchPolicy: "no-cache",variables: { email: user?.email }});
  // let memberData = data?.yc_members[0];

  const logo = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.logo);
  const yachtClubName = useSelector(state => state?.auth?.member?.yachtClubByYachtClub.name);
  const userIsCommodore = useSelector(state => state?.auth?.user?.userIsCommodore);
  const memberData = useSelector(state => state?.auth?.member);

  useEffect(() => {
    if (user?.email_verified && !memberData?.id) {
      const {email, given_name: firstName, family_name: lastName, name, picture: profilePic} = user;
      const upsertUser = async () => {
        const resp = await upsertMember({variables: {
          email,
          firstName,
          lastName,
          name,
          profilePic,
          lasrLogin: getIsoDate(),
          yachtClub: "97ead1a2-9702-4a18-bf2d-6c1f3be3a919", // TEMP hard code for beta testing.
        }});
        const userData = { member: resp.data.insert_yc_members.returning[0], user: user };
        dispatch(addMember(userData));
      }
      upsertUser();
    }
  }, [user, userIsCommodore])

  if (isLoading) return <CircularProgress />;

  const betaMakeCommodore = async () => {
    const {name, id: memberId} = memberData;
    console.log('memberData', memberData)
    const resp = await betaGiveCommodoreStatus({variables: {name, memberId, ycId: "97ead1a2-9702-4a18-bf2d-6c1f3be3a919"}});
    dispatch(betaUpdateUserIsCommodoreAct(true));
  };

  // if (user === undefined) {
  //   router.push('/login');
  //   return null;
  // }

  // if (data.yc_members.length === 0) {
  //   dispatch(addNonMember(user))
  //   router.push('/yc_regions');
  //   return null;
  // }
  // if (error) router.push('/login');
  console.log('userIsCom :', userIsCommodore)
  return (
    <div>
      <NavBar/>
      <div className={styles.center}>
        <div className={styles.titleSection}>
          <Typography variant="h3">Welcome to {yachtClubName}</Typography>
          {logo && <img src={logo} />}
          {!userIsCommodore && <Typography sx={{margin: 2}} variant="body1">
            This App is currently in Beta testing mode. You are currently logged in as a BYC member. Click below to give yourself full permissions as commodore and race chair. Or look around a bit first.
          </Typography>}
          {userIsCommodore && 
          <Stack>
            <Typography sx={{margin: 2, maxWidth: 600}} variant="body1">
              Congrats! you have full permissions. You can now explore features like create race events, and create yacht club events.
              Get started by clicking the toolbar in the upper left corner. Don't forget to edit your member profile 
            </Typography>
            <Grid container justifyContent="center">
              <Typography sx={{marginRight: 2}} variant='body1'>
                Happy Sailing!  
              </Typography>
              <SailingIcon color="primary" />
            </Grid>

          </Stack>
          }          
          {!userIsCommodore &&
          <Button variant="outlined" onClick={betaMakeCommodore}>
            full permissions
          </Button>}
        </div>
      </div>
    </div>
  );
}

export default Yachty;
