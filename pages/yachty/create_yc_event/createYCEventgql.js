import { gql } from '@apollo/client';

export const INSERT_YC_EVENT = gql`
mutation insertYCEvent(
    $ycId: uuid, 
    $specialClubHours: String, 
    $entertainment: String, 
    $eventName: String, 
    $hours: String, 
    $date: String
) {
  insert_yc_events(objects: {
    ycId: $ycId, 
    special_club_hours: $specialClubHours, 
    entertainment: $entertainment, 
    event_name: $eventName, 
    hours: $hours, 
    date: $hours,
  }) {
    affected_rows
  }
}`;
