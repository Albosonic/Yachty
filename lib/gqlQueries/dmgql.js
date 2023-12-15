import { gql } from "@apollo/client"

export const GET_ALL_USER_ROOMS_BY_ID = gql`
  query getAlluserRooms($memberId: uuid!) {
  user_rooms(where: {_or: [{memberId: {_eq: $memberId}}, {recipientId: {_eq: $memberId}}]}) {
    id
    lastSeen
    memberId
    recipientId
    newMessage
  }
}`;

export const GET_USERS_ROOM = gql`
  query getUsersRoom($memberId: uuid!, $recipientId: uuid) {
  user_rooms(where: {_or: {recipientId: {_eq: $recipientId}, memberId: {_eq: $memberId}}}) {
    lastSeen
    id
  }
}`

export const INSERT_MESSAGE = gql`
  mutation insertMessage($authorId: uuid!, $createdAt: timestamptz, $message: String, $roomId: uuid!) {
  insert_messages_one(object: {authorId: $authorId, created_at: $createdAt, message: $message, roomId: $roomId}) {
    roomId
    message
    id
    created_at
    authorId
  }
  update_user_rooms(where: {id: {_eq: $roomId}}, _set: {newMessage: $authorId}) {
    affected_rows
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

