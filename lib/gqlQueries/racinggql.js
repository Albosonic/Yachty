import { gql } from "@apollo/client"

export const INSERT_RACE_COURSE = gql`
  mutation insertRaceCourse($courseName: String, $instructions: jsonb, $ycId: uuid) {
  insert_race_courses_one(object: {courseName: $courseName, instructions: $instructions, ycId: $ycId}) {
    courseName
  }
}`;

export const GET_RACE_COURSES_BY_YCID = gql`
  query getRaceCoursesById($ycId: uuid) {
    race_courses(where: {ycId: {_eq: $ycId}}) {
      ycId
      instructions
      id
      courseName
    }
  }
`;

export const INSERT_RACE_ONE = gql`
mutation insertRace($object: races_insert_input!) {
  insert_races_one(object: $object) {
    seriesId
    eventId
    id
    img
    raceCourseId
    startDate
    endDate
    raceName
    ycId,
    startTime
    endTime
  }
}`;

export const GET_RACE_BY_ID = gql`
  query getRaceById($raceId: uuid!) {
  races(where: {id: {_eq: $raceId}}) {
    endDate
    eventId
    id
    img
    raceCourseId
    raceName
    startDate
    ycId
    startTime,
    endTime
  }
}`;

export const INSERT_RACE_SERIES = gql`
  mutation MyMutation($seriesName: String, $ycId: uuid!) {
  insert_race_series_one(object: {seriesName: $seriesName, ycId: $ycId}) {
    id
    seriesName
  }
}`;

export const GET_RACE_SERIES_BY_YC_ID = gql`
  query getRaceSeriesByYcId($ycId: uuid!) {
  race_series(where: {ycId: {_eq: $ycId}}) {
    id
    seriesName
  }
}`;

export const INSERT_RACE_TICKET_FOR_PURCHASE = gql`
  mutation insertRaceTicketForPurchase($cost: Int!, $raceId: uuid!, $ycId: uuid!) {
  insert_race_tickets_for_purchase(objects: {cost: $cost, raceId: $raceId, ycId: $ycId}) {
    affected_rows
  }
}`;

export const LINK_EVENT_TO_RACE = gql`
  mutation linkEventToRace($raceId: uuid, $eventId: uuid) {
  update_races(where: {id: {_eq: $raceId}}, _set: {eventId: $eventId}) {
    affected_rows
  }
}`;
