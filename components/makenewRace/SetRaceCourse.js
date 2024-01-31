import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { GET_RACE_COURSES_BY_YCID } from '@/lib/gqlQueries/racinggql';
import LoadingYachty from '../LoadingYachty';
import { useDispatch, useSelector } from 'react-redux';
import { gql, useMutation, useQuery } from '@apollo/client';
import {  RACE_FIELDS, makeNewRaceFieldAct } from '@/slices/actions/workingRaceActions';
import CreateCourseDialog from './dialogs/CreateCourseDialog';
import { useRouter } from 'next/router';
import { Alert, Snackbar } from '@mui/material';

const UPDATE_RACE_COURSE = gql`
  mutation updateRaceCourse($raceId: uuid!, $raceCourseId: uuid!) {
  update_races(where: {id: {_eq: $raceId}}, _set: {raceCourseId: $raceCourseId}) {
    affected_rows
  }
}`;

const SetRaceCourse = ({callback, alternateTitle}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const [creatingCourse, setCreatingCourse] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const open = Boolean(anchorEl)
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id)
  const userIsChair = useSelector(state => state.auth.user.userIsRaceChair)
  const [updateRaceCourse, {loading: updateLoading}] = useMutation(UPDATE_RACE_COURSE)
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

  const menuItemClick = async (course) => {
    if (callback) {
      setAnchorEl(null)
      dispatch(makeNewRaceFieldAct({course: course}));
      callback(RACE_NAME)
    } else {
      const raceId = router.query.raceId
      const {id: raceCourseId} = course
      await updateRaceCourse({
        variables: {
          raceId,
          raceCourseId,
        }
      })
      setShowSuccess(true)
    }
  }

  const handleClose = (course) => {
    setAnchorEl(null)
  };

  const createCourse = () => {
    setCreatingCourse(true);
  }

  const snackBarClose = () => {
    setAnchorEl(null)
    setShowSuccess(false)
  }

  return (
    <>

      {userIsChair &&
        <>
          <Snackbar open={showSuccess} autoHideDuration={2000} onClose={snackBarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Success!
            </Alert>
          </Snackbar>
          <CreateCourseDialog open={creatingCourse} setOpen={setCreatingCourse} refetch={refetchCourses}/>
          <Button
            id="course-select-button"
            size='large'
            aria-controls={open ? 'race-course-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            variant="contained"
            endIcon={<ArrowDropDownIcon />}
            sx={{minWidth: 223}}
          >
            {alternateTitle || 'choose a course'}
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
            {courses.map((course, i) => <MenuItem key={course.courseName + i} onClick={() => menuItemClick(course)}>{course.courseName}</MenuItem>)}
            <MenuItem key="create series" onClick={createCourse}>{'...create course'}</MenuItem>
          </Menu>
        </>
      }
    </>
  );
}

export default SetRaceCourse;