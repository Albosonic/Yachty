import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

// cd2d68cb-7eca-44df-8027-66fa36617436 club albo
// fbf64755-e7e7-4593-b4b5-12bf5f210f94 memberId Alberto
// 33db963e-ea05-4b77-b90e-a126f6dd17e7 club kersti
// ba93c153-c63f-4f22-9637-430aa6aa84d7 memberId tester one

const YCMemberView = () => {
  const router = useRouter();
  const yachtClubByYachtClub = useSelector((state => state?.auth?.member?.yachtClubByYachtClub));
  // const { id: ycId } = yachtClubByYachtClub;
  const ycId = yachtClubByYachtClub?.id
  console.log('wtf id ====', ycId)
  return (
    <Stack spacing={2}>
      <Typography variant="h3">
        Hello
      </Typography>
      <Typography variant="h4">
        what actions would like to perform?
      </Typography>
      <Button onClick={() => router.push({pathname:'yachty/request_reciprocity', query: { ycId }})} variant="outlined">
        Request Reciprocity
      </Button>
      <Button onClick={() => router.push({pathname: 'yachty/blog_posts', query: { ycId }})} variant="outlined">
        Blog Posts
      </Button>
      <Button onClick={() => router.push({pathname: 'yachty/club_calendar', query: { ycId }})} variant="outlined">
        Club Calendar
      </Button>
    </Stack>
  )
}

export default YCMemberView;

// query MyQuery {
//   reciprocal_request(where: {visitingYCId: {_eq: "cd2d68cb-7eca-44df-8027-66fa36617436"}}) {
//     unafilliatedVesselId
//     vesselId
//     homeYCId
//     requestingSlip
//     visitingDate
//     visitingYCId
//     specialNotes
//     status
//     yc_member {
//       email
//       name
//       vessels {
//         id
//         type
//         vesselName
//         length
//         insuranceInfo
//         hullMaterial
//         draft
//         beam
//       }
//       id
//       yachtClubByYachtClub {
//         name
//       }
//     }
//     yacht_club {
//       name
//       id
//     }
//   }
// }