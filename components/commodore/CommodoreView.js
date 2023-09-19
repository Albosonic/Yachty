import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const CommodoreView = () => {
  const router = useRouter();
  const yachtClubByYachtClub = useSelector((state => state?.auth?.member?.yachtClubByYachtClub));
  const { name, id } = yachtClubByYachtClub;
  return (
    <Stack spacing={2}>
      <Typography variant="h3">
        Hello { name } Commodore
      </Typography>
      <Typography variant="h4">
        what actions would like to perform?
      </Typography>
      <Button onClick={() => router.push({pathname:'yachty/add_member', query: { ycId: id }})} variant="outlined">
        Add New Members
      </Button>
      <Button onClick={() => router.push({pathname: 'yachty/reciprocal_requests', query: { ycId:id }})} variant="outlined">
        Review Reciprocal Requests
      </Button>
      <Button onClick={() => router.push({pathname: 'yachty/edit_club_profile', query: { ycId:id }})} variant="outlined">
        Edit Club Profile
      </Button>
    </Stack>
  )
}

export default CommodoreView;