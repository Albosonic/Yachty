import { gql } from "@apollo/client";

export const GET_ALL_YC_BY_REGION = gql`
  query allYCByRegion($regionId: uuid) {
  yacht_clubs(where: {region: {_eq: $regionId}}) {
    name
    id
  }
}`;

export const GET_ALL_REGIONS = gql`
  query getAllRegions {
    regions {
      name
      id
    }
  }
`;