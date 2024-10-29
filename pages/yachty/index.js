import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import styles from '@/styles/yachty.module.css'
import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { addMember, betaUpdateUserIsCommodoreAct } from '@/slices/actions/authActions';
import SailingIcon from '@mui/icons-material/Sailing';
import LoadingYachty from '@/components/LoadingYachty';
import NewUserDialog from '@/components/NewUserDialog';
import { useSession } from 'next-auth/react';
import { GET_YC_MEMBER } from '@/lib/gqlQueries/yachtygql';
import { useRouter } from 'next/router';

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
        race_chairs {
          memberId
        }
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
  const dispatch = useDispatch();
  const router = useRouter()
  const session = useSession()
  const { data, status } = session
  const user = data?.user

  const {error, loading: loadingMemberData, data: memberResp} = useQuery(GET_YC_MEMBER, {
    variables: {
      email: user?.email
    }
  })

  const [betaGiveCommodoreStatus, {loading: betaLoading}] = useMutation(BETA_GIVE_COMMODORE_STATUS)
  const logo = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.logo);
  const yachtClubName = useSelector(state => state?.auth?.member?.yachtClubByYachtClub.name);
  const userIsCommodore = useSelector(state => state?.auth?.user?.userIsCommodore);
  const memberData = useSelector(state => state?.auth?.member);
  const name = useSelector(state => state?.auth?.member?.name);
  const email = useSelector(state => state?.auth?.member?.email);
  const introSeen = useSelector(state => state?.auth?.introSeen);
  const [newUserOpen, setNewUserOpen] = useState(false)

  useEffect(() => {
    console.log('session ========', session)
    const authenticated = status === "authenticated"
    const userData = memberResp?.yc_members[0]
    if(authenticated && !loadingMemberData) {
      dispatch(addMember(userData));
    }
  },[status, loadingMemberData])

  // if(loadingMemberData) return <LoadingYachty />

  // poll for messages, need to mgrate to Web Sockets
  // useEffect(() => {
  //   dispatch(pollUserRooms())
  // })

  // useEffect(() => {
  //   if (user?.email && !memberData?.id) {
  //     const {email, given_name: firstName, family_name: lastName, name, picture: profilePic} = user;
  //     const upsertUser = async () => {
  //       const resp = await upsertMember({
  //         fetchPolicy: 'no-cache',
  //         variables: {
  //           email,
  //           firstName,
  //           lastName,
  //           name,
  //           profilePic,
  //           lasrLogin: getIsoDate(),
  //           yachtClub: "97ead1a2-9702-4a18-bf2d-6c1f3be3a919", // TEMP hard code for beta testing deploy.
  //         }
  //       });
  //       const userData = { member: resp.data.insert_yc_members.returning[0], user: user };
  //       dispatch(addMember(userData));
  //     }

  //     upsertUser();
  //   }
  //   dispatch(pollUserRooms())
  //   if (name.includes('.com')) {
  //     setNewUserOpen(!introSeen)
  //   }
  // }, [user, userIsCommodore, name, introSeen])

  // if (upsertMemberLoading) return <LoadingYachty />;

  const betaMakeCommodore = async () => {
    const {name, id: memberId} = memberData;
    const resp = await betaGiveCommodoreStatus({variables: {name, memberId, ycId: "97ead1a2-9702-4a18-bf2d-6c1f3be3a919"}});
    dispatch(betaUpdateUserIsCommodoreAct(true));
  };

  return (
    <div>
      <NavBar/>
      <NewUserDialog open={newUserOpen} setOpen={setNewUserOpen} />
      <div className={styles.center}>
        <div className={styles.titleSection}>
          <Typography sx={{margin: 2}} variant="h3">{yachtClubName}</Typography>
          {logo &&
            <Box
              component="img"
              sx={{
                borderRadius: '50%',
                width: 200,
                height: 200,
              }}
              alt="race chair photo"
              src={logo}
            />
          }
          {!userIsCommodore && <Typography sx={{margin: 2}} variant="body1">
            This App is currently in Alpha testing mode. You are currently logged in as a BYC member. Click below to give yourself full permissions as commodore and race chair. Or look around a bit first.
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
