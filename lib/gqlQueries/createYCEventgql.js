import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

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
    $endDate: date,
    $startTime: String,
    $endTime: String
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
    endDate: $endDate,
    startTime: $startTime,
    endTime: $endTime
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
    $startDate: date,
    $endDate: date,
    $startTime: String,
    $endTime: String
  ) {
  update_yc_events(where: {id: {_eq: $id}}, _set: {
    date: $date, 
    entertainment: $entertainment, 
    event_name: $eventName, 
    hours: $hours, 
    image: $image, 
    location: $location,
    specialNotes: $specialNotes,
    startDate: $startDate,
    endDate: $endDate,
    startTime: $startTime,
    endTime: $endTime
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
    special_club_hours
    location
    specialNotes
    startDate
    endDate
    startTime
    endTime
  }
}`;

export const useEventData = () => {
  const router = useRouter();
  const eventId = router.query.eventId;
  const {data, loading, error} = useQuery(GET_YC_EVENT, {
    variables: {id: eventId}
  })
  return {error, loading, data};
}


export const UPSERT_EVENT_TICKET = gql`
  mutation upsertYCEventTicket($dinnerCost: Int, $cost: Int, $eventId: uuid!, $ycId: uuid!) {
  insert_yc_event_tickets_for_purchase(on_conflict: {
    constraint: yc_event_tickets_for_purchase_pkey, 
    update_columns: cost
  }, objects: {dinnerCost: $dinnerCost ,cost: $cost, eventId: $eventId, ycId: $ycId}) {
    returning {
      cost
      dinnerCost
    }
  }
}`;
