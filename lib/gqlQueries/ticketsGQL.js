import { gql } from "@apollo/client";

export const INSERT_PURCHASED_TICKETS = gql`
  mutation insertPurchasedTickets($objects: [yc_event_purchased_tickets_insert_input!]!) {
  insert_yc_event_purchased_tickets(
  objects: $objects) {
    returning {
      memberId
      ticketForPurchaseId,      
      eventId,
    }
  }
}`;

export const DELETE_EVENT_TICKET = gql`
  mutation deleteEVentTickets($ids: [uuid!]!) {
    delete_yc_event_purchased_tickets(where: {id: {_in: $ids}}) {
    affected_rows
  }  
}`;



export const INSERT_DINNER_TICKETS = gql`
  mutation insertDinnerTickets($objects: [yc_event_dinner_tickets_insert_input!]!) {
  insert_yc_event_dinner_tickets(objects: $objects) {
    affected_rows
    returning {
      id
    }
  }
}`;

export const DELETE_DINNER_TICKETS = gql`
  mutation deleteDinnerTickets($ids: [uuid!]!) {
    delete_yc_event_dinner_tickets(where: {id: {_in: $ids}}) {
    affected_rows
  }
}`;

export const GET_PURCHASED_EVENT_TICKETS_BY_IDS = gql`
  query getPurchasedEventTicketsById($eventId: uuid!, $memberId: uuid!) {
    yc_event_purchased_tickets(where: {eventId: {_eq: $eventId}, memberId: {_eq: $memberId}}) {    
    paid
    id
  }
}`;

export const GET_PURCHASED_DINNER_TICKETS_BY_IDS = gql`
  query getPurchasedEventTicketsById($eventId: uuid!, $memberId: uuid!) {
    yc_event_dinner_tickets(where: {eventId: {_eq: $eventId}, memberId: {_eq: $memberId}}) {    
    id
  }
}`;

export const GET_EVENT_TICKET_FOR_PURCHASE = gql`
  query getEventTicketForPurchase($eventId: uuid!) {
  yc_event_tickets_for_purchase(where: {eventId: {_eq: $eventId}}) {
    id
    cost
    dinnerCost
  }
}`;
