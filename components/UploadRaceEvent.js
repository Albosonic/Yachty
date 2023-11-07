import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GET_RACE_COURSES_BY_YCID } from "@/lib/gqlQueries/racinggql";
import NavBar from "./NavBar";
import RaceCourseMenu from "./RaceCourseMenu";

const UploadRaceEvent = () => {
  const [course, setCourse] = useState(null);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const {error, loading, data} = useQuery(GET_RACE_COURSES_BY_YCID, {variables: { ycId }});
  if (loading) return <CircularProgress />;
  console.log('course ===', course);

  return (
    <>
      <RaceCourseMenu courses={data.race_courses} setCourse={setCourse} />
    </>

  )
}

export default UploadRaceEvent;