import { gql } from "@apollo/client"

export const INSERT_RACE_COURSE = gql`
  mutation insertRaceCourse($courseName: String, $instructions: jsonb, $ycId: uuid) {
  insert_race_courses_one(object: {courseName: $courseName, instructions: $instructions, ycId: $ycId}) {
    courseName
  }
}`;
