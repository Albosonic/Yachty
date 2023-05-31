import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const YCMemberView = () => {
  const router = useRouter();
  const yachtClubByYachtClub = useSelector((state => state.auth.member.yachtClubByYachtClub));
  const { ycId } = yachtClubByYachtClub;
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