import { gql } from '@apollo/client';

export const INSERT_YC_EVENT = gql`
mutation insertYCEvent(
    $ycId: uuid, 
    $specialClubHours: String, 
    $entertainment: String, 
    $eventName: String,
    $location: String,
    $specialNotes: String,
    $hours: String, 
    $date: String,
    $image: String,
    $startDate: date,
) {
  insert_yc_events(objects: {
    ycId: $ycId, 
    special_club_hours: $specialClubHours, 
    entertainment: $entertainment, 
    event_name: $eventName, 
    location: $location, 
    specialNotes: $specialNotes,
    hours: $hours, 
    date: $date,
    image: $image,
    startDate: $startDate,
  }) {
    returning {
      id
      event_name
      entertainment
      date
      image
    }
  }
}`;

export const UPDATE_YC_EVENT = gql`
  mutation updateYcEvent(
    $date: String, 
    $entertainment: String, 
    $eventName: String,
    $location: String,
    $specialNotes: String,
    $hours: String,
    $image: String,
    $id: uuid,
  ) {
  update_yc_events(where: {id: {_eq: $id}}, _set: {
    date: $date, 
    entertainment: $entertainment, 
    event_name: $eventName, 
    hours: $hours, 
    image: $image, 
    location: $location,
    specialNotes: $specialNotes, 
    }) {
    returning {
      ycId
      special_club_hours
      specialNotes
      raceId
      location
      image
      id
      hours
      event_name
      entertainment
      date
    }
  }
}`;

export const GET_YC_EVENT = gql`
  query getYachtClubEvent($id: uuid!) {
  yc_events(where: {id: {_eq: $id}}) {
    date
    entertainment
    event_name
    hours
    id
    image
    raceId
    special_club_hours, 
    location,
    specialNotes
  }
}`;

export const UPSERT_EVENT_TICKET = gql`
  mutation upsertYCEventTicket($cost: Int, $eventId: uuid!, $ycId: uuid!) {
  insert_yc_event_tickets_for_purchase(on_conflict: {
    constraint: yc_event_tickets_for_purchase_pkey, 
    update_columns: cost
  }, objects: {cost: 10, eventId: $eventId, ycId: $ycId}) {
    returning {
      cost
    }
  }
}`;
