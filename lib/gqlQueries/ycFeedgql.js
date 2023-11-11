import { gql } from "@apollo/client";

export const GET_YC_EVENTS_FEED = gql`
  query getYcEventsFeed($ycId: uuid!, $after: date) {
  yc_events(where: {ycId: {_eq: $ycId}, startDate: {_gte: $after}}, order_by: {startDate: asc}) {
    date
    entertainment
    event_name
    hours
    id
    image
    location
    startDate
  }
}`;

export const INSERT_EVENT_COMMENT = gql`
  mutation insertOneComment($object: comments_insert_input!) {
  insert_comments_one(object: $object) {
    comment
    createdAt
    eventId
    parentId
    img
    id
  }
}`;

export const GET_EVENT_COMMENTS = gql`
  query getEventComments($eventId: uuid!) {
    comments(where: {eventId: {_eq: $eventId}}, order_by: {createdAt: asc}) {
    comment
    createdAt
    eventId
    id
    img
    memberId
    parentId
    raceId
    yc_member {
      firstName
      profilePic
    }
  }
}`;

export const EVENT_TICKET_FOR_PURCHASE = gql`
  query getEventTicketForPurchase($eventId: uuid!) {
    yc_events(where: {id: {_eq: $eventId}}) {
    entertainment
    event_name
    hours
    image
    location
    specialNotes
    date
    yc_event_tickets_for_purchase {
      cost
      id
    }
  }
}`;
