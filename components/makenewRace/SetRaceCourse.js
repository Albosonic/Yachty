import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { GET_RACE_COURSES_BY_YCID } from '@/lib/gqlQueries/racinggql';
import LoadingYachty from '../LoadingYachty';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import {  RACE_FIELDS, makeNewRaceFieldAct } from '@/slices/actions/workingRaceActions';

const SetRaceCourse = ({callback}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const {error, loading, data, refetch: refetchCourses} = useQuery(GET_RACE_COURSES_BY_YCID, {
    variables: { ycId }, 
    fetchPolicy: 'no-cache'
  });

  const {RACE_NAME} = RACE_FIELDS;

  if (loading) return <LoadingYachty isRoot={false} />
  
  const courses = data.race_courses;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (course) => {
    setAnchorEl(null);
    dispatch(makeNewRaceFieldAct({course: course}));
    callback(RACE_NAME)
  };

  return (
    <>
      <Button
        id="course-select-button"
        aria-controls={open ? 'race-course-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"        
        endIcon={<ArrowDropDownIcon />}
        sx={{minWidth: 223}}
      >
        choose a course
      </Button>
      <Menu
        id="course-selector"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'course-select',
        }}
      >
        {courses.map((course, i) => <MenuItem key={course.courseName + i} onClick={() => handleClose(course)}>{course.courseName}</MenuItem>)}
      </Menu>
    </>
  );
}

export default SetRaceCourse;