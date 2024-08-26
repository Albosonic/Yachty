import { gql } from "@apollo/client";
// export const GET_YC_MEMBER = gql`
//   query getYCMember($email: String) {
//     yc_members(where: {email: {_eq: $email}}) {
//     email
//     firstName
//     lastName
//     isRacer
//     id
//     name
//     profilePic
//     bio
//     yachtClubByYachtClub {
//       id
//       name
//       region
//       logo
//       commodore {
//         member_id
//         name
//         id
//       }
//     }
//     vessels {
//       beam
//       draft
//       hullMaterial
//       id
//       img
//       vesselImage
//       insuranceInfo
//       length
//       ownerId
//       specialNotes
//       type
//       unafilliatedVesselId
//       vesselImage
//       vesselName
//     }
//   }
// }`;


export const GET_YC_MEMBER = gql`
query getYachtClubMember($email: String) {
  yc_members(where: {email: {_eq: $email}}) {
    email
    firstName
    id
    active
    bio
    duesOwed
    isRacer
    lastLogin
    lastName
    name
    profilePic
    yacht_club
    secondEmail
    secondFirstName
    secondLastName
    secondName
    yachtClubByYachtClub {
      id
      logo
      name
      region
      race_chairs {
        memberId
        ycId
        id
      }
    }
    commodore {
      member_id
      name
      id
    }
    vessels {
      beam
      draft
      hullMaterial
      id
      img
      insuranceInfo
      length
      make
      marina
      model
      ownerId
      sailNumber
      slip
      specialNotes
      type
      unafilliatedVesselId
      vesselName
    }
  }
}
`