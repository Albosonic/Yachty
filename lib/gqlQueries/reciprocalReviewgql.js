import { gql } from "@apollo/client";

export const REICPROCAL_REQEST_DATA_STRINGS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  LETTER_SENT: 'LETTER_SENT',
  AWAITING_RESPONSE: 'AWAITING_RESPONSE',
};

export const UPDATE_RECIPROCAL_REQUEST = gql`
  mutation updateReciprocalRequest($id: uuid, $status: String) {
  update_reciprocal_request(_set: {status: $status}, where: {id: {_eq: $id}}) {
    affected_rows
  }
}`;

export const GET_RECIPROCAL_REQUESTS_BY_YC = gql`
  query getReciprocalRequestsByYc($ycId: uuid) {
    reciprocal_request(where: {homeYCId: {_eq: $ycId}}) {
    unafilliatedVesselId
    vesselId
    homeYCId
    visitingYCId
    requestingSlip
    visitingDate
    status
    id
    yc_member {
      firstName
      email
      lastName
      active
      bio
      profilePic
      yachtClubByYachtClub {
        name
      }
    }
    yacht_club {
      name
    }
  }
}`;

export const GET_RECIPROCAL_AWAITING_RESPONSE = gql`
  query getReciprocalLettersSent($visitingYCId: uuid) {
    reciprocal_request(where: {visitingYCId: {_eq: $visitingYCId}, status: {_eq: "AWAITING_RESPONSE"}}) {
      visitingDate
      id
      yc_member {
        name
      }
      yacht_club {
        name
        commodore {
          name
        }
      }
      yachtClubByHomeycid {
        name
        commodore {
          name
          yc_member {
            name
          }
        }
      }
    }
  }
`;

