import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { Button, CircularProgress, Grid, Stack, TextField, Typography } from "@mui/material";
import { GET_RACE_COURSES_BY_YCID, INSERT_RACE_ONE } from "@/lib/gqlQueries/racinggql";
import RaceCourseMenu from "./RaceCourseMenu";
import RaceCourseDetails from "./RaceCourseDetails";
import ImageUploadField from "./ImageUploadField";
import { YC_EVENT } from "@/slices/actions/authActions";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { IMG_BUCKET, s3Client } from "@/lib/clients/s3-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import RaceEvent from "./RaceEvent";

// const UPLOAD_RACE_IMAGE = "UPLOAD_RACE_IMAGE";

const SelectedTimeRange = ({startDate, endDate}) => {
  if (!startDate) return null;
  if (!endDate) return null;
  const startDay = startDate.slice(0, 10);
  const startHrs = startDate.slice(11);
  const endDay = endDate.slice(0, 10);
  const endHrs = endDate.slice(11);
  if (startDay === endDay) return <Typography variant="h5">{`${startDay} ${startHrs} - ${endHrs}`}</Typography>
  return  <Typography variant="h5">{`${startDay} ${startDayHours} - ${endDay} ${endHrs}`}</Typography>
}

const UploadRaceEvent = () => {
  const clearRaceInfo = { courseId: null, raceName: '', raceCourseId: null, img: '', raceNameSet: false , startDate: null, endDate: null, review: false, newRaceId: null };
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [course, setCourse] = useState(null);
  const [raceInfo, setRaceInfo] = useState(clearRaceInfo);
  const [raceName, setRaceName] = useState('');
  const [imageObj, setImageObj] = useState({}); 
  const [formErrors, setFormErrors] = useState({chooseCourse: false});
  const {error, loading, data} = useQuery(GET_RACE_COURSES_BY_YCID, {variables: { ycId }});
  const [insertRace, {loading: insertRaceLoading}] = useMutation(INSERT_RACE_ONE);

  if (loading) return <CircularProgress />;
  const {raceName: raceTitle, raceCourseId, img, raceNameSet, startDate, endDate, review, newRaceId } = raceInfo;
  const submitRace = async () => {
    if (course === null) return setFormErrors({ ...formErrors, chooseCourse: true })
    const {fileDatum, src, imgKey} = imageObj;
    const { id: courseId } = course;    
    const imagePath = `${IMG_BUCKET}${imgKey}`;
    console.log('race titel:', raceTitle)

    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: fileDatum,
      ContentType: 'image/png'
    };
  
    // await s3Client.send(new PutObjectCommand(params));
    const variables = {
      object: {
        eventId: null,
        img: imagePath,
        raceName: raceTitle,
        raceCourseId: courseId,
        startDate: startDate,
        endDate: endDate,
        ycId: ycId,
      }
    };
    // const resp = await insertRace({variables});    
    // console.log('resp :', resp)
    // get id and pass to RaceEvent component
    // setRaceInfo({ ...raceInfo, review: true, newRaceId: resp.data.insert_races_one.id });
  }

  const editRace = () => {    
    setRaceInfo({
      ...raceInfo,
      review: false,
    })
  }
  
  const showDatePickers = startDate === null || endDate === null ? true : false;
  const {chooseCourse} = formErrors;
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
      {!raceNameSet && 
        <TextField
          required
          multiline
          placeholder="Race Name..."
          variant="standard"
          value={raceName}
          onChange={(e) => setRaceName(e.target.value)}
          InputProps={{endAdornment: <Button onClick={() => setRaceInfo({...raceInfo, raceName: raceName, raceNameSet: true})}>Set</Button>}}
        />
      }
      {raceNameSet &&
        <Grid container justifyContent="center" width="100%" sx={{padding: 3}} >
          <Typography variant="h4">{raceName}</Typography>
          <Button onClick={() => setRaceInfo({...raceInfo, raceName: raceName, raceNameSet: false})} >Edit</Button>
        </Grid>
      }      
      <RaceCourseMenu courses={data.race_courses} setCourse={setCourse} />
      {chooseCourse && <Typography variant="subtitle1" color="error">please choose a course</Typography>}
      
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
          <Typography variant="subtitle1" >To</Typography>
          <DateTimeField required onBlur={(e) => setRaceInfo({...raceInfo, endDate: e.target.value})} label="Date Time" defaultValue={dayjs(new Date())} />
        </>
      }
      {!showDatePickers && <SelectedTimeRange startDate={startDate} endDate={endDate} />}
      <ImageUploadField type={YC_EVENT} setImageObjToParent={setImageObj} img={imageObj} title="Upload Race Poster" />
      <Button onClick={() => submitRace()}>Submit</Button>
    </Stack>)
  )
}

export default UploadRaceEvent;