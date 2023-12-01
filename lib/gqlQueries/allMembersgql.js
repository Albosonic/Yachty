import { gql } from "@apollo/client";

export const GET_ALL_YC_MEMBERS = gql`
  query getAllYachtClubMembers($ycId: uuid) {
    yc_members(where: {yacht_club: {_eq: $ycId}}) {
      id
      active
      email
      name
      duesOwed
      profilePic
      bio
      vessels {
        vesselName
        hullMaterial
        sailNumber
        specialNotes
        type
        make
        model
        length
        beam
        draft
        marina
        slip
        img
      }
    }
}`;

export const INSERT_ROOM = gql`
  mutation insertRoom($id: String $name: String, $type: String, $group: String) {
  insert_room(objects: {name: $name, type: $type, group: $group}, on_conflict: {constraint: room_name_key, update_columns: group}) {
    returning {
      id
      name
      type
    }
  }
}`;

export const INSERT_USER_ROOMS = gql`
  mutation insertUserRooms($objects:[user_rooms_insert_input!]!) {
  insert_user_rooms(objects: $objects, on_conflict: {constraint: user_rooms_participantId_key, update_columns: lastSeen}) {
    returning {
      id
      memberId
      roomId
      lastSeen
      participantId
      recipientId
    }
  }
}`;