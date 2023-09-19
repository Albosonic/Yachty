import { gql } from "@apollo/client";

export const UPDATE_YC_LOGO_KEY = gql`
mutation updateYCLogoKey($ycId: uuid, $logo: String) {
  update_yacht_clubs(where: {id: {_eq: $ycId}}, _set: {logo: $logo}) {
    affected_rows
  }
}`;
  