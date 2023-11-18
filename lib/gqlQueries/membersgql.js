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

export const UPDATE_MEMBER_BIO = gql`
  mutation updateMemberProfile($memberId: uuid!, $bio: String) {
  update_yc_members(where: {id: {_eq: $memberId}}, _set: {bio: $bio}) {
    returning {
      bio
    }
  }
}`;

export const GET_MEMBERS_BY_RACE_ID = gql`
  query membersByRaceId($raceId: uuid!) {
    yc_members(where: {race_tickets_purchaseds: {raceId: {_eq: $raceId}}}) {
      id
      active
      email
      name
      duesOwed
      profilePic
      bio
      vessels {
        length
        type
        vesselName
        img
        make
        model
        marina
        slip
      }
      yachtClubByYachtClub {
        name
        logo
      }
    }
  }
`;
