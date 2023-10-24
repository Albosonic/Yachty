import { gql } from "@apollo/client";
export const GET_YC_MEMBER = gql`
  query getYCMember($email: String) {
    yc_members(where: {email: {_eq: $email}}) {
    email
    firstName
    lastName
    id
    name
    profilePic
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
