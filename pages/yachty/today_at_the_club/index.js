import NavBar from "@/components/NavBar";
import { Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const TodayAtTheClub = (props) => {
  // const member = useSelector(state => state.auth.member);
  return (
    <>
      <NavBar />
      <Stack spacing={10} alignItems="center">
        <Typography variant="h5">Today at the club</Typography>
      </Stack>
    </>
  )
}

export default TodayAtTheClub;