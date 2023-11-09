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
    eventId
    id
    img
    raceCourseId
    startDate
    endDate
    raceName
    ycId
  }
}`;
