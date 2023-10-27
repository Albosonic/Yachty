import { gql } from "@apollo/client";

export const INSERT_NEW_YC_APPLICANT = gql`
  mutation insertYCApplicant(
    $email: String, 
    $firstName: String, 
    $lastName: String,
    $secondFirstName: String,
    $secondLastName: String,
    $secondEmail: String,
    $referredBy: String, 
    $yacht_club: uuid
  ) {
    insert_potential_members(
      objects: {
        email: $email,
        firstName: $firstName,
        lastName: $lastName,
        secondEmail: $secondEmail,
        secondFirstName: $secondFirstName,
        secondLastName: $secondLastName,
        referredBy: $referredBy,
        yacht_club: $yacht_club
      }) {
      returning {
        yacht_club
        secondLastName
        secondFirstName
        secondEmail
        referredBy
        membershipDenied
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_MEMBER_BY_ID = gql`
  query getMemberById {
  yc_members(where: {id: {_eq: "fbf64755-e7e7-4593-b4b5-12bf5f210f94"}}) {
    email
    firstName
    id
    name
  }
}`;

export const GET_NEW_MEMBER_APPLICATIONS = gql`
  query getNewMemberApplications($email: String) {
    potential_members(where: {email: {_eq: $email}}) {
      membershipDenied
      yacht_club
    }
  }
`;

export const GET_YACHT_CLUB_BY_ID = gql`
  query getYachtClubById($ycId: uuid) {
  yacht_clubs(where: {id: {_eq: $ycId}}) {
    logo
    name
  }
}
`