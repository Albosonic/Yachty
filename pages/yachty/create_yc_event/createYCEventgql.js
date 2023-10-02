import { gql } from '@apollo/client';

export const INSERT_YC_EVENT = gql`
mutation insertYCEvent(
    $ycId: uuid, 
    $specialClubHours: String, 
    $entertainment: String, 
    $eventName: String, 
    $hours: String, 
    $date: String,
    $image: String,
) {
  insert_yc_events(objects: {
    ycId: $ycId, 
    special_club_hours: $specialClubHours, 
    entertainment: $entertainment, 
    event_name: $eventName, 
    hours: $hours, 
    date: $date,
    image: $image,
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
    special_club_hours
  }
}`;
