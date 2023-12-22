import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import dayjs from "dayjs";
import { DateTimeField } from "@mui/x-date-pickers";
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQuery } from "@apollo/client";
import { Alert, Button, Fab, Grid, IconButton, Snackbar, Stack, TextField, Typography } from "@mui/material";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { GET_RACE_COURSES_BY_YCID, GET_RACE_SERIES_BY_YC_ID, INSERT_RACE_ONE, INSERT_RACE_SERIES } from "@/lib/gqlQueries/racinggql";
import { YC_EVENT } from "@/slices/actions/authActions";
import RaceCourseMenu from "./RaceCourseMenu";
import RaceCourseDetails from "./RaceCourseDetails";
import ImageUploadField from "./ImageUploadField";
import { IMG_BUCKET, s3Client } from "@/lib/clients/s3-client";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RaceEvent from "./RaceEvent";
import RaceSeriesMenu from "./RaceSeriesMenu";
import SelectedTimeRange from "./SelectedTimeRange";
import RaceReleaseMenu from "./RaceReleaseMenu";
import LoadingYachty from "./LoadingYachty";
import { useRouter } from "next/router";
import { workingRaceDateAct } from "@/slices/actions/schedulerActions";

const UploadRaceEvent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const clearRaceInfo = { courseId: null, raceName: '', raceCourseId: null, img: '', raceNameSet: false , startDate: null, endDate: null, review: false, newRaceId: null };
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const workingDate = useSelector(state => state.scheduler.workingRaceDate)
  const [course, setCourse] = useState(null);
  const [series, setSeries] = useState(null);
  const [raceInfo, setRaceInfo] = useState(clearRaceInfo);
  const [raceName, setRaceName] = useState('');
  const [imageObj, setImageObj] = useState({});
  const [creatingSeries, setCreatingSeries] = useState(false);
  const [seriesName, setSeriesName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [releaseForm, setReleaseForm] = useState(null);
  const [formErrors, setFormErrors] = useState({
    chooseCourseError: false,
    raceTitleError: false,
    seriesError: false,
    startDateError: false,
    endDateError: false,
    releaseFormError: false,
  });
  const {error, loading, data, refetch: refetchCourses} = useQuery(GET_RACE_COURSES_BY_YCID, {variables: { ycId }, fetchPolicy: 'no-cache'});
  const {error: getSeriesError, loading: getSeriesLoading, data: raceSeriesData, refetch: refetchRaceSeries} = useQuery(GET_RACE_SERIES_BY_YC_ID, {variables: { ycId }, pollInterval: 1500});
  const [insertRace, {loading: insertRaceLoading}] = useMutation(INSERT_RACE_ONE);
  const [insertSeries, {loading: insertSeriesLoading}] = useMutation(INSERT_RACE_SERIES);

  if (loading || getSeriesLoading) return <LoadingYachty isRoot={false} />;

  const {raceName: raceTitle, raceCourseId, img, raceNameSet, startDate, endDate, review, newRaceId } = raceInfo;
  const raceSeriesArr = raceSeriesData?.race_series

  const submitRace = async () => {
    if (course === null) return setFormErrors({ ...formErrors, chooseCourseError: true });
    if (startDate === null) return setFormErrors({ ...formErrors, startDateError: true });
    if (series === null) return setFormErrors({ ...formErrors, seriesError: true });
    if (endDate === null) return setFormErrors({ ...formErrors, endDateError: true });
    if (raceTitle === '') return setFormErrors({ ...formErrors, raceTitleError: true });
    if (raceTitle === '') return setFormErrors({ ...formErrors, raceTitleError: true });
    if (raceTitle === '') return setFormErrors({ ...formErrors, raceTitleError: true });
    if (releaseForm === null) return setFormErrors({ ...formErrors, releaseFormError: true });

    const {fileDatum, src, imgKey} = imageObj;
    const { id: courseId } = course;
    const imagePath = `${IMG_BUCKET}${imgKey}`;

    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: fileDatum,
      ContentType: 'image/png'
    };

    await s3Client.send(new PutObjectCommand(params));

    const startTime = startDate.slice(11);
    const endTime = endDate.slice(11);
    const variables = {
      object: {
        seriesId: series.id,
        eventId: null,
        img: imagePath,
        raceName: raceTitle,
        raceCourseId: courseId,
        startDate: startDate,
        endDate: endDate,
        ycId: ycId,
        startTime,
        endTime,
        releaseFormId: releaseForm.id,
      }
    };

    const resp = await insertRace({variables});
    setRaceInfo({ ...raceInfo, review: true, newRaceId: resp.data.insert_races_one.id });
  }

  const creatRaceSeries = async () => {
    await insertSeries({variables: {seriesName, ycId}});
    await refetchRaceSeries();
    setShowSuccess(true)
  }

  const snackBarClose = () => {
    setCreatingSeries(false);
    setShowSuccess(false);
  }

  const editRace = () => {
    setRaceInfo({
      ...raceInfo,
      review: false,
    })
  };

  const addReleaseForm = (form) => {    
    setReleaseForm(form);
    setFormErrors({...formErrors, releaseFormError: false});
  }

  const goBack = () => {    
    dispatch(workingRaceDateAct(null))
    router.replace({pathname: '/yachty/calendar'})    
  }

  const {chooseCourseError, raceTitleError, seriesError, startDateError, endDateError} = formErrors;
  const showDatePickers = startDate === null || endDate === null || startDateError || endDateError ? true : false;
  const defaultStartDate = workingDate ? dayjs(workingDate.start.value) : null;

  return (
    review ? (
      <RaceEvent newRaceId={newRaceId} review={review} edit={editRace} />
    ) : (
    <Stack
      spacing={4}
      width="100%"
      alignItems="center"
      sx={{
        overflow: "hidden",
        overflowY: "scroll",
        height: 600,
        padding: 2        
      }}
    >
      {workingDate && 
        <Fab 
          size="small" 
          onClick={goBack} 
          variant="extended" 
          sx={{ 
            alignSelf: 'flex-start', 
            margin: 3
          }} 
          color="primary">
          <ArrowBackIcon /> 
          Back
        </Fab>
      }
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={snackBarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={snackBarClose} severity="success" sx={{ width: '100%' }}>
          Success!
        </Alert>
      </Snackbar>
      { !series && <RaceSeriesMenu seriesArr={raceSeriesArr} setSeries={setSeries} setCreatingSeries={setCreatingSeries}/> }

      { series &&
        <Grid sx={{padding: 2}} container justifyContent="center">
          <Typography variant="h4">{ series?.seriesName }</Typography>
          <IconButton onClick={() => setSeries(null)}>
            <EditIcon sx={{fontSize: 20}} color="primary" />
          </IconButton>
        </Grid>
      }
      { seriesError && <Typography variant="subtitle1" color="error">please enter series</Typography> }

      {creatingSeries &&
        <TextField
          required
          multiline
          placeholder="Series Name..."
          variant="standard"
          value={seriesName}
          onChange={(e) => setSeriesName(e.target.value)}
          InputProps={{endAdornment: <Button onClick={ creatRaceSeries }>Create</Button>}}
        />
      }

      {/* TODO: integrate error into component, and do it for every one Here */}
      {!course && <RaceCourseMenu courses={data.race_courses} setCourse={setCourse} />}    
      {chooseCourseError && <Typography variant="subtitle1" color="error">please choose a course</Typography>}
      {/* TODO: integrate error into component, and do it for every one Here */}
      {course &&
        <Stack spacing={2}>
          <Grid container justifyContent="center">
            <Typography variant="h5">
              {course?.courseName}
            </Typography>
            <IconButton onClick={() => setCourse(null)}>
              <EditIcon sx={{fontSize: 20}} color="primary" />
            </IconButton>
          </Grid>
          <Typography variant="subtitle1" >(Course details will not be released until the race admin releases them)</Typography>
          <RaceCourseDetails course={course} />
        </Stack>
      }
      {!releaseForm && <RaceReleaseMenu addReleaseForm={addReleaseForm} />}
      {releaseForm && 
        <Grid container justifyContent="center">
          <Typography variant="h6">{releaseForm.name}</Typography>
          <CheckOutlinedIcon color="success" />
        </Grid>
      }
      {!raceNameSet &&
        <>
          <TextField
            required
            multiline
            placeholder="Race Name..."
            variant="standard"
            value={raceName}
            onChange={(e) => setRaceName(e.target.value)}
            InputProps={{endAdornment: <Button onClick={() => setRaceInfo({...raceInfo, raceName: raceName, raceNameSet: true})}>Set</Button>}}
          />
          {raceTitleError && <Typography variant="subtitle1" color="error">please choose a race name</Typography>}
        </>
      }
      {raceNameSet &&
        <Grid container justifyContent="center" width="100%" sx={{padding: 3}} >
          <Typography variant="h4">{raceName}</Typography>
          <Button onClick={() => setRaceInfo({...raceInfo, raceName: raceName, raceNameSet: false})} >Edit</Button>
        </Grid>
      }
      {showDatePickers &&
        <>
          <Typography variant="subtitle1" >From</Typography>
          <DateTimeField 
            required 
            onBlur={(e) => setRaceInfo({...raceInfo, startDate: e.target.value})} 
            label="Date Time" 
            defaultValue={defaultStartDate || dayjs(new Date())} 
          />
          {startDateError && <Typography color="error">please choose start date</Typography>}
          <Typography variant="subtitle1" >To</Typography>
          <DateTimeField 
            required 
            onBlur={(e) => setRaceInfo({...raceInfo, endDate: e.target.value})} 
            label="Date Time" 
            defaultValue={defaultStartDate || dayjs(new Date())} 
          />
          {endDateError && <Typography color="error">please choose end date</Typography>}
        </>
      }
      {!showDatePickers && <SelectedTimeRange startDate={startDate} endDate={endDate} />}
      <ImageUploadField type={YC_EVENT} setImageObjToParent={setImageObj} img={imageObj} title="Upload Race Poster" />
      <Button onClick={() => submitRace()}>Submit</Button>
    </Stack>)
  )
}

export default UploadRaceEvent;