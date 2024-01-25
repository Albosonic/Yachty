import { gql, useQuery } from "@apollo/client"
import { useRouter } from "next/router";

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
    releaseFormId
  }
}`;

export const GET_RACE_BY_ID = gql`
  query getRaceById($raceId: uuid!) {
  races(where: {id: {_eq: $raceId}}) {
    endDate
    eventId
    id
    img
    raceName
    startDate
    ycId
    startTime,
    endTime,
    raceTicketId,
    raceCourseId
    race_series {
      seriesName
      id
    }
    race_course {
      instructions
      courseName
      id
    }
    race_tickets_for_purchase {
      id
      cost
    }
    race_release_form {      
      id
    }     
  }
}`;

export const useRaceData = () => {
  const router = useRouter();
  const raceId = router.query.raceId;  
  const {error, loading, data} = useQuery(GET_RACE_BY_ID, {
    variables: { raceId }
  })
  return {error, loading, data};
}


export const GET_RACES_BY_YCID_AFTER_DATE = gql`
  query getRacesByYcIdAfterDate($ycId: uuid!, $startDate: date) {
  races(where: {ycId: {_eq: $ycId}, startDate: {_gte: $startDate}}) {
    endDate
    endTime
    eventId
    img
    raceCourseId
    raceName
    startDate
    startTime
    id
    race_release_form {      
      id
    }     
    yc_event {
      yc_event_tickets_for_purchase {
        id
      }
    }
  }
}`;

export const GET_RACES_BY_YCID_BEFORE_DATE = gql`
  query getRacesByYcIdBeforeDate($ycId: uuid!, $startDate: date) {
  races(
  where: {
    ycId: {
      _eq: $ycId
    }, 
    startDate: {
      _lte: $startDate
    }
  }) {
    endDate
    endTime
    eventId
    img
    raceCourseId
    raceName
    startDate
    startTime
    id
    race_release_form {
      id
    }    
    yc_event {
      yc_event_tickets_for_purchase {
        id
      }
    }
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
    affected_rows,
    returning {
      id
    }
  }
}`;

export const UPDATE_RACE_TICKET_COST = gql`
  mutation updateRaceTicketCost($ticketId: uuid!, $cost: Int) {
  update_race_tickets_for_purchase(where: {id: {_eq: $ticketId}}, _set: {cost: $cost}) {
    returning {
      cost
    }
  }
}
`;

export const UPDATE_RACE_W_TICKET_ID = gql`
  mutation updateRaceWTicketId($raceId: uuid!, $raceTicketId: uuid!) {
  update_races(where: {id: {_eq: $raceId}}, _set: {raceTicketId: $raceTicketId}) {
    affected_rows
  }
}`;

export const UPDATE_RACE = gql`
  mutation updateRace($raceId: uuid!, $object: races_set_input!) {
  update_races(where: {id: {_eq: $raceId}}, _set: $object ) {
    affected_rows
  }
}`;

export const LINK_EVENT_TO_RACE = gql`
  mutation linkEventToRace($raceId: uuid, $eventId: uuid) {
  update_races(where: {id: {_eq: $raceId}}, _set: {eventId: $eventId}) {
    affected_rows
  }
}`;

export const GET_RACE_TICKET_RESERVATION = gql`
  query getRaceTicketReservation($raceId: uuid!, $memberId: uuid!) {
  race_tickets_purchased(where: {raceId: {_eq: $raceId}, memberId: {_eq: $memberId}}) {
    paid
  }
}`;

export const GET_RACERS_BY_YCID = gql`
  query getRacersByYcId($ycId: uuid!) {
    yc_members(where: {yacht_club: {_eq: $ycId}, isRacer: {_eq: true}}) {
    id
    email
    firstName
    lastName
    isRacer
    id
    name
    profilePic
    bio
    yachtClubByYachtClub {
      id
      name
      region
      logo
      commodore {
        member_id
        name
        id
      }
    }
    vessels {
      beam
      draft
      hullMaterial
      id
      img      
      insuranceInfo
      length
      ownerId
      specialNotes
      type
      unafilliatedVesselId      
      vesselName
    }
  }
}`;
