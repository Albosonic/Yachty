"client-side"

import LoadingYachty from "@/components/LoadingYachty";
import NavBar from "@/components/NavBar";
import RacerProfileCard from "@/components/RacerProfileCard";
import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Stack } from "@mui/material";
import { useRouter } from "next/router";

export const GET_YC_MEMBER = gql`
  query getYCMember($memberId: uuid!) {
    yc_members(where: {id: {_eq: $memberId}}) {
    email
    firstName
    lastName
    isRacer
    id
    name
    profilePic
    bio
    yachtClubByYachtClub {
      id
      name
      region
      logo
      commodore {
        member_id
        name
        id
      }
    }
    vessels {
      beam
      draft
      hullMaterial
      id
      img
      vesselImage
      insuranceInfo
      length
      ownerId
      specialNotes
      type
      unafilliatedVesselId
      vesselImage
      vesselName
    }
  }
}`;

const RacerView = () => {
  const router = useRouter();
  const memberId = router.query.memberId;

  const {error, loading, data} = useQuery(GET_YC_MEMBER, {variables: {memberId}});
  
  if (loading) return <LoadingYachty />;

  return (
    <>
      <NavBar />
      <Stack alignItems="center" spacing={2} sx={{margin: 5}}>
        <RacerProfileCard shareData={data} />
      </Stack>
    </>
  )  
}

export default RacerView;