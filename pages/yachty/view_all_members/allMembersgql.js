import { gql } from "@apollo/client";

export const GET_ALL_YC_MEMBERS = gql`
  query getAllYachtClubMembers($ycId: uuid) {
    yc_members(where: {yacht_club: {_eq: $ycId}}) {
      active
      email
      name
      duesOwed
      vessels {
        length
        type
        vesselName
      }
    }
}`;