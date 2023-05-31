import { gql } from "@apollo/client";

export const GET_YACHT_CLUB = gql`
  query getYachtClub($ycId: uuid) {
    yacht_clubs(where: {id: {_eq: $ycId}}) {
      name
      id
    }
  }
`;