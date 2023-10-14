import { gql } from "@apollo/client";
export const GET_YC_MEMBER = gql`
  query getYCMember($email: String) {
    yc_members(where: {email: {_eq: $email}}) {
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
    email
    firstName
    lastName
    id
    name
    profilePic
  }
}
`;
