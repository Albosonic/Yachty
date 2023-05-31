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
    insert_potential_members(objects: {
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
        firstName
      }
    }
  }
`;