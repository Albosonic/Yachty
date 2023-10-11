import { gql } from "@apollo/client";

export const GET_YC_EVENTS_FEED = gql`
  query getYcEventsFeed($ycId: uuid!, $after: date) {
  yc_events(where: {ycId: {_eq: $ycId}, startDate: {_gte: $after}}, order_by: {startDate: asc}) {
    date
    entertainment
    event_name
    hours
    id
    image
    location
    startDate
  }
}
`