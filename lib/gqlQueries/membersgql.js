import { gql } from "@apollo/client";

export const GET_RACE_MEMBER = gql`
  query gerRaceMember($memberId: uuid!) {
  yc_members(where: {id: {_eq: $memberId}}) {
    firstName
    email
    bio
    vessels {
      img
      hullMaterial
      draft
      beam
      length
      type
      vesselImage
      vesselName
      insuranceInfo
    }
  }
}`;
