import { gql } from "@apollo/client";

export const INSERT_PURCHASED_TICKETS = gql`
  mutation insertPurchasedTickets(
    $memberId: uuid!,
    $ticketForPurchaseId: uuid!,
    $eventId: uuid!,
    $withDinner: Boolean
  ) {
  insert_yc_event_purchased_tickets(
  objects: [{
    memberId: $memberId,
    ticketForPurchaseId: $ticketForPurchaseId,
    withDinner: $withDinner,
    eventId: $eventId,
  }]) {
    returning {
      memberId
      ticketForPurchaseId,
      withDinner,
      eventId,
    }
  }
}`;

export const UPDATE_PURCHASED_TICKET = gql`
  mutation updatePurchasedTicket($ticketId: uuid!, $withDinner: Boolean!) {
  update_yc_event_purchased_tickets(
    where: {
      id: {
        _eq: $ticketId
      }},
      _set: {
        withDinner: $withDinner
      }
    ) {
    affected_rows
  }
}`;

export const GET_PURCHASED_EVENT_TICKETS_BY_IDS = gql`
  query getPurchasedEventTicketsById($eventId: uuid!, $memberId: uuid!) {
    yc_event_purchased_tickets(where: {eventId: {_eq: $eventId}, memberId: {_eq: $memberId}}) {
    withDinner
    paid
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

export const DELETE_EVENT_TICKET = gql`
  mutation deleteEVentTicket($eventId: uuid!) {
  delete_yc_event_purchased_tickets(where: {id: {_eq: $eventId}}) {
    affected_rows
  }
}`;