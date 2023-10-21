import { gql } from "@apollo/client"

export const GET_ALL_USER_ROOMS = gql`
  query getAlluserRooms($memberId: uuid!) {
  user_rooms(where: {_or: [{memberId: {_eq: $memberId}}, {recipientId: {_eq: $memberId}}]}) {
    id
    lastSeen
    memberId
    participantId
    recipientId
    roomId
    yc_member {
      profilePic
      firstName
      id
    }
  }
}`;

export const INSERT_MESSAGE = gql`
  mutation insertMessage($object: messages_insert_input!) {
  insert_messages_one(object: $object) {  
    roomId
    message
    id
    created_at
    authorId
  }
}`;

// export const DIRECT_MESSAGE_SUBSCRIPTION = gql`
//   subscription MySubscription($roomId: uuid!) {
//   messages(where: {roomId: {_eq: $roomId}}, order_by: {created_at: asc}) {
//     authorId
//     created_at
//     id
//     message
//     roomId
//   }
// }`;

export const POLL_ALL_MESSAGES = gql`
  query pollAllMessages($roomId: uuid!) {
  messages(where: {roomId: {_eq: $roomId}}, order_by: {created_at: asc}) {
    authorId
    created_at
    id
    message
    roomId
    yc_member {
      profilePic
      firstName
      id
    }
  }
}`;

