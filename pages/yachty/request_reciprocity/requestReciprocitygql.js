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