import { useState } from "react";
import { useSelector } from "react-redux";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import dayjs from "dayjs";
import { DateTimeField } from "@mui/x-date-pickers";
import { useMutation, useQuery } from "@apollo/client";
import { Alert, Button, CircularProgress, Grid, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { GET_RACE_COURSES_BY_YCID, GET_RACE_SERIES_BY_YC_ID, INSERT_RACE_ONE, INSERT_RACE_SERIES } from "@/lib/gqlQueries/racinggql";
import { YC_EVENT } from "@/slices/actions/authActions";
import RaceCourseMenu from "./RaceCourseMenu";
import RaceCourseDetails from "./RaceCourseDetails";
import ImageUploadField from "./ImageUploadField";
import { IMG_BUCKET, s3Client } from "@/lib/clients/s3-client";
import RaceEvent from "./RaceEvent";
import RaceSeriesMenu from "./RaceSeriesMenu";
import SelectedTimeRange from "./SelectedTimeRange";

const UploadRaceEvent = () => {
  const clearRaceInfo = { courseId: null, raceName: '', raceCourseId: null, img: '', raceNameSet: false , startDate: null, endDate: null, review: false, newRaceId: null };
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [course, setCourse] = useState(null);
  const [series, setSeries] = useState(null);
  const [raceInfo, setRaceInfo] = useState(clearRaceInfo);
  const [raceName, setRaceName] = useState('');
  const [imageObj, setImageObj] = useState({});
  const [creatingSeries, setCreatingSeries] = useState(false);
  const [seriesName, setSeriesName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({
    chooseCourseError: false, 
    raceTitleError: false, 
    seriesError: false,
    startDateError: false,
    endDateError: false,
  });
  const {error, loading, data, refetch: refetchCourses} = useQuery(GET_RACE_COURSES_BY_YCID, {variables: { ycId }, fetchPolicy: 'no-cache'});
  const {error: getSeriesError, loading: getSeriesLoading, data: raceSeriesData, refetch: refetchRaceSeries} = useQuery(GET_RACE_SERIES_BY_YC_ID, {variables: { ycId }, pollInterval: 1500});
  const [insertRace, {loading: insertRaceLoading}] = useMutation(INSERT_RACE_ONE);
  const [insertSeries, {loading: insertSeriesLoading}] = useMutation(INSERT_RACE_SERIES);

  if (loading || getSeriesLoading) return <CircularProgress />;

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

  const {chooseCourseError, raceTitleError, seriesError, startDateError, endDateError} = formErrors;
  const showDatePickers = startDate === null || endDate === null || startDateError || endDateError ? true : false;
  
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
        margin: 5
      }}
    >
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={snackBarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={snackBarClose} severity="success" sx={{ width: '100%' }}>
          Success!
        </Alert>
      </Snackbar>
      { !series && <RaceSeriesMenu seriesArr={raceSeriesArr} setSeries={setSeries} setCreatingSeries={setCreatingSeries}/> }

      { series && <Typography variant="h4">{ series?.seriesName }</Typography> }
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
      <RaceCourseMenu courses={data.race_courses} setCourse={setCourse} />
      {chooseCourseError && <Typography variant="subtitle1" color="error">please choose a course</Typography>}
      {/* TODO: integrate error into component, and do it for every one Here */}

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

      {course &&
        <Stack>
          <Grid container justifyContent="center">
            <Typography variant="h5">
              {course?.courseName}
            </Typography>
            <RaceCourseDetails course={course} />
          </Grid>
          <Typography variant="subtitle1" >(Course details will not be released until the race admin releases them)</Typography>
        </Stack>
      }
      {showDatePickers &&
        <>
          <Typography variant="subtitle1" >From</Typography>
          <DateTimeField required onBlur={(e) => setRaceInfo({...raceInfo, startDate: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} />
          {startDateError && <Typography color="error">please choose start date</Typography>}
          <Typography variant="subtitle1" >To</Typography>
          <DateTimeField required onBlur={(e) => setRaceInfo({...raceInfo, endDate: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} />
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