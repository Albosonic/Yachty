import { gql } from "@apollo/client";

export const REICPROCAL_REQEST_DATA_STRINGS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DENIED: 'DENIED',
  LETTER_SENT: 'LETTER_SENT',
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
      yachtClubByYachtClub {
        name
      }
    }
    yacht_club {
      name
    }
  }
}`;

// { "no": "43434hfikwnf", "company": "farmers", "expires": "2023-06-22" }

// query MyQuery {
//   reciprocal_request(where: {visitingYCId: {_eq: "cd2d68cb-7eca-44df-8027-66fa36617436"}}) {
    // unafilliatedVesselId
    // vesselId
    // homeYCId
    // requestingSlip
    // visitingDate
    // visitingYCId
    // specialNotes
    // status
    // yc_member {
    //   email
    //   name
    //   vessels {
    //     id
    //     type
    //     vesselName
    //     length
    //     insuranceInfo
    //     hullMaterial
    //     draft
    //     beam
    //   }
    //   id
    // }
//   }
// }

export const GET_VISITOR_REQUESTS_BY_YC = gql`
  query getReciprocalRequestsByYc($ycId: uuid) {
    reciprocal_request(where: {visitingYCId: {_eq: $ycId}}) {
    unafilliatedVesselId
    vesselId
    homeYCId
    requestingSlip
    visitingDate
    visitingYCId
    specialNotes
    status
    yc_member {
      email
      name
      vessels {
        id
        type
        vesselName
        length
        insuranceInfo
        hullMaterial
        draft
        beam
      }
      id
    }
  }
}`;

// "reciprocal_request": [
//   {
//     "unafilliatedVesselId": null,
//     "vesselId": "6734081a-1b37-4920-99b9-810cbc9b25c0",
//     "homeYCId": "cd2d68cb-7eca-44df-8027-66fa36617436",
//     "requestingSlip": false,
//     "visitingDate": "2023-06-25",
//     "visitingYCId": "cd2d68cb-7eca-44df-8027-66fa36617436",
//     "specialNotes": "HI there",
//     "status": "pending",
//     "yc_member": {
//       "email": "snipeboatblue@gmail.com",
//       "name": "Alberto Madueno",
//       "vessels": [
//         {
//           "id": "5e31d234-7f4b-461f-9633-c1638db36462",
//           "type": "sail",
//           "vesselName": "Jackalope",
//           "length": 36,
//           "insuranceInfo": {
//             "no": "43434hfikwnf",
//             "company": "farmers",
//             "expires": "2023-06-22"
//           },
//           "hullMaterial": "fiber glass",
//           "draft": 6,
//           "beam": 15
//         }
//       ],
//       "id": "4929646c-7aaf-4aed-bd88-eafff310342c"
//     },
//     "yacht_club": {
//       "name": "Club Albo",
//       "id": "cd2d68cb-7eca-44df-8027-66fa36617436"
//     }
//   },
