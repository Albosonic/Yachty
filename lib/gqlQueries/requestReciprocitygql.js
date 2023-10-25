import { gql } from "@apollo/client";

export const GET_YACHT_CLUB_AND_VESSEL_INFO = gql`
  query getYCandVesselInfo($ycId: uuid, $ownerId: uuid) {
    yacht_clubs(where: {id: {_eq: $ycId}}) {
    name
    id
  }
  vessels(where: {ownerId: {_eq: $ownerId}}) {
    beam
    draft
    hullMaterial
    id
    insuranceInfo
    img
    length
    ownerId
    specialNotes
    type
    vesselName
  }
}`;

// insert unafilliated vessels without ownerId.
// add a column to the vessels table called unafilliated vesselId
// add a column to reciprocal request table "unafiliated vesselId"
// then store that instead of vesselId.
export const INSERT_RECIPROCAL_REQUEST_NEW_VESSEL = gql`
  mutation insertReciprocalRequestAndVessel(
    $homeYCId: uuid, 
    $memberId: uuid, 
    $requestingSlip: Boolean,
    $unafilliatedVesselId: uuid,
    $vesselName: String,
    $visitingDate: date, 
    $visitingYCId: uuid,
    $beam: Int,
    $draft: Int,
    $insuranceInfo: jsonb,
    $length: Int,
    $hullMaterial: String,
    $specialNotes: String,
    $type: String,
  ) {
  insert_reciprocal_request(objects: {
    homeYCId: $homeYCId, 
    memberId: $memberId, 
    requestingSlip: $requestingSlip, 
    specialNotes: $specialNotes,
    visitingDate: $visitingDate, 
    visitingYCId: $visitingYCId,
    unafilliatedVesselId: $unafilliatedVesselId,
  }) {
    returning {
      requestingSlip
      visitingDate
    }
  }
  insert_vessels(objects: {
    unafilliatedVesselId: $unafilliatedVesselId,
    beam: $beam, 
    draft: $draft, 
    hullMaterial: $hullMaterial, 
    insuranceInfo: $insuranceInfo, 
    length: $length, 
    specialNotes: $specialNotes, 
    type: $type, 
    vesselName: $vesselName
  }, on_conflict: {constraint: vessels_pkey, update_columns: beam}) {
    returning {
      vesselName
      beam
      draft
      length
    }
  }
}`;

export const INSERT_RECIPROCAL_REQUEST = gql`
  mutation insertReciprocalRequestOwnVessel(
    $homeYCId: uuid, 
    $memberId: uuid, 
    $requestingSlip: Boolean,
    $visitingDate: date, 
    $visitingYCId: uuid,
    $beam: interger,
    $vesselId: uuid,
    $specialNotes: String,
  ) {
  insert_reciprocal_request(objects: {
    homeYCId: $homeYCId, 
    memberId: $memberId, 
    requestingSlip: $requestingSlip, 
    specialNotes: $specialNotes, 
    vesselId: $vesselId, 
    visitingDate: $visitingDate, 
    visitingYCId: $visitingYCId,
  }) {
    returning {
      requestingSlip
      visitingDate
    }
  }
}`;
