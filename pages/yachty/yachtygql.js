import { gql } from "@apollo/client";
export const GET_YC_MEMBER = gql`
  query getYCMember($email: String) {
    yc_members(where: {email: {_eq: $email}}) {
    commodore {
      id
      active
    }
    yachtClubByYachtClub {
      id
      name
      region
    }
    email
    firstName
    lastName
    id
    name
  }
}
`;