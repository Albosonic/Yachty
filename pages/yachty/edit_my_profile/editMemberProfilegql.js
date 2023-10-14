import { gql } from "@apollo/client";

export const UPDATE_PROFILE_PICTURE_HASURA = gql`
  mutation UpdateProfilePicture($memberId: uuid! $profilePic: String) {
    update_yc_members(where: {id: {_eq: $memberId}}, _set: {profilePic: $profilePic}) {
    returning {
      profilePic
    }
  }
}`;
