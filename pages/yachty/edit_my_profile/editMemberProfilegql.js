import { gql } from "@apollo/client";

export const UPDATE_PROFILE_PICTURE_HASURA = gql`
  mutation UpdateProfilePicture($memberId: uuid! $profilePic: String) {
    update_yc_members(where: {id: {_eq: $memberId}}, _set: {profilePic: $profilePic}) {
    returning {
      profilePic
    }
  }
}`;

export const INSERT_MEMBER_VESSEL = gql`
  mutation inserMemberVessel(
    $vesselName: String!, 
    $vesselImage: String, 
    $beam: Int, 
    $draft: Int, 
    $hullMaterial: String, 
    $img: String, 
    $insuranceInfo: jsonb, 
    $length: Int, 
    $ownerId: uuid!, 
    $specialNotes: String, 
    $type: String
  ) {
    insert_vessels(objects: {
      vesselName: $vesselName, 
      vesselImage: $vesselImage, 
      beam: $beam, 
      draft: $draft, 
      hullMaterial: $hullMaterial, 
      img: $img, 
      insuranceInfo: $insuranceInfo, 
      length: $length, 
      ownerId: $ownerId, 
      specialNotes: $specialNotes, 
      type: $type
    }) {
    affected_rows
  }
}`;

export const UPDATE_MEMBER_VESSEL = gql`
  mutation inserMemberVessel(
    $vesselName: String!, 
    $vesselImage: String, 
    $beam: Int, 
    $draft: Int, 
    $hullMaterial: String, 
    $img: String, 
    $insuranceInfo: String, 
    $length: Int, 
    $ownerId: String, 
    $specialNotes: String, 
    $type: String
  ) {
    insert_vessels(where: {ownerId: {_eq: $ownerId}}, _set: {
      vesselName: $vesselName, 
      vesselImage: $vesselImage, 
      beam: $beam, 
      draft: $draft, 
      hullMaterial: $hullMaterial, 
      img: $img, 
      insuranceInfo: $insurance, 
      length: $length, 
      ownerId: $ownerId, 
      specialNotes: $specialNotes, 
      type: $type
    }) {
    affected_rows
  }
}`;

export const GET_YC_MEMBER_AND_VESSEL = gql`
  query getYCMember($memberId: uuid!) {
    yc_members(where: {id: {_eq: $memberId}}, ) {
    active
    bio
    duesOwed
    email
    firstName
    id
    lastName
    name
    profilePic
    vessels {
      beam
      draft
      hullMaterial
      id
      img
      insuranceInfo
      length
      ownerId
      specialNotes
      type
      unafilliatedVesselId
      vesselImage
      vesselName
    }
  }
}`;

export const UPDATE_MEMBER_AND_VESSEL = gql`
  mutation updateMemberAndVessel(
    $memberId: uuid,
    $vesselId: uuid, 
    $bio: String,
    $beam: Int, 
    $draft: Int, 
    $hullMaterial: String, 
    $img: String, 
    $insuranceInfo: jsonb, 
    $length: Int,
    $ownerId: uuid,
    $specialNotes: String, 
    $type: String, 
    $unafilliatedVesselId: String, 
    $vesselImage: String, 
    $vesselName: String, 
  ) {
    update_yc_members(where: {id: {_eq: $memberId}}, 
    _set: {
      bio: $bio
    }) {
      affected_rows
  }
  update_vessels(where: {id: {_eq: $vesselId}}, 
  _set: {
    beam: $beam, 
    draft: $draft, 
    hullMaterial: $hullMaterial, 
    img: $img, 
    insuranceInfo: $insuranceInfo, 
    length: $length,
     ownerId: $ownerId, 
     specialNotes: $specialNotes, 
     type: $type, 
     unafilliatedVesselId: $vesselId, 
     vesselImage: $vesselImage, 
     vesselName: $vesselName
    }) {
    affected_rows
  }
}`;

export const UPDATE_YC_MEMBER_BIO = gql`
  mutation updateMemberBio($memberId: uuid! ,$bio: String) {
    update_yc_members(where: {id: {_eq: $memberId}}, _set: {bio: $bio}) {
    affected_rows
  }
}`;
