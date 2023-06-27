import { gql } from "@apollo/client";
export const GET_YC_MEMBER = gql`
  query getYCMember($email: String) {
    yc_members(where: {email: {_eq: $email}}) {
    yachtClubByYachtClub {
      id
      name
      region
      commodore {
        name
        id
      }
    }
    email
    firstName
    lastName
    id
    name
  }
}
`;
