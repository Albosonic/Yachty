const { gql } = require("@apollo/client");

export const GET_ALL_MEMBER_APPLICANTS = gql`
  query getAllMemberApplicants($ycId:uuid) {
    potential_members(where: {membershipDenied: {_eq: false}, yacht_club: {_eq: $ycId}}){
      firstName
      lastName
      email
      secondEmail
      secondFirstName
      secondLastName
      referredBy
    }
  }
`;

export const ADD_NEW_MEMBER = gql`
  mutation addMember(
    $firstName: String, 
    $lastName: String, 
    $name: String, 
    $email: String,
    $secondFirstName: String,
    $secondLastName: String,
    $secondName: String,
    $secondEmail: String,
    $ycId: uuid
  ) {
    insert_yc_members(
      objects: {
        firstName: $firstName, 
        lastName: $lastName, 
        name: $name,
        email: $email,
        secondFirstName: $secondFirstName,
        secondLastName: $secondLastName,
        secondName: $secondName,
        secondEmail: $secondEmail,
        yacht_club: $ycId,
      }) {
      returning {
        name
        yachtClubByYachtClub {
          name
        }
      }
    }
    delete_potential_members(where: {email: {_eq: $email}}) {
      affected_rows
    }
  }
`;

export const DENY_MEMBERSHIP = gql`
  mutation denyYCMembership($email:String) {
    update_potential_members(_set: {membershipDenied: true}, where: {email: {_eq: $email}}) {
      affected_rows
    }
  }
`;
