import { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import styles from '@/styles/yachty.module.css'
import { gql, useMutation, useQuery } from '@apollo/client';
import { useUser } from '@auth0/nextjs-auth0/client';
import { CircularProgress, Typography } from '@mui/material';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { addMember, addNonMember } from '@/slices/actions/authActions';
import { GET_YC_MEMBER } from '@/lib/gqlQueries/yachtygql';
import { getIsoDate } from '@/lib/utils/getters';

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

const Yachty = () => {
  // const router = useRouter();
  const { user, isLoading } = useUser();
  const dispatch = useDispatch();
  const [upsertMember, {loading: upsertMemberLoading}] = useMutation(UPSERT_MEMBER)

  // const { loading, error, data, refetch } = useQuery(GET_YC_MEMBER,{fetchPolicy: "no-cache",variables: { email: user?.email }});
  // let memberData = data?.yc_members[0];

  const logo = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.logo);
  const userIsCommodore = useSelector(state => state?.auth?.userIsCommodore);
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
  }, [user])

  if (isLoading) return <CircularProgress />;

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

  const welcomText = userIsCommodore ? `Welcome Commodore ${memberData.firstName}` : `Welcome ${memberData.firstName}`;
  return (
    <div>
      <NavBar/>
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
