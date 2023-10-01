import { useRouter } from 'next/router';
import { Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';

import dayjs from 'dayjs';
import { useMutation } from '@apollo/client';
import { INSERT_YC_EVENT } from './createYCEventgql';
import ImageUploadField from '@/components/ImageUploadField';
import NavBar from '@/components/NavBar';
import styled from '@emotion/styled';
import { Margin } from '@mui/icons-material';
// import DatePicker from '@/components/DatePicker';

// $ycId: uuid, 
// $specialClubHours: String, 
// entertainment: String, 
// $eventName: String, 
// $hours: String, 
// $hours: String, 
// $date: String

const CreateYCEvent = () => {
  const router = useRouter();
  const ycId = router.query.ycId;
  const [CreateYCEvent, { loading, data, error }] = useMutation(INSERT_YC_EVENT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // await CreateYCEvent({
    //   variables: {
    //     ycId: ycId,
    //     specialClubHours: e.target.specialClubHours.value,
    //     entertainment: e.target.entertainment.value,
    //     eventName: e.target.eventName.value,
    //     hours: e.target.hours.value,
    //     date: e.target.date.value,
    //   },
    // });  
    
  }

  const FormLayout = styled(Stack)(({ theme }) => ({
    // backgroundColor: '#fff',
    // padding: theme.spacing(3),
    padding: 15,
    paddingBottom: 25,
    textAlign: 'center',
    // color: theme.palette.text.secondary,
    width: '100%',
    maxWidth: 700,
    margin: '0 auto',
  }));
  return (
    <>
    <NavBar />
      <Paper sx={{padding: 5, maxWidth: 700, margin: '0 auto'}} elevation={3}>
        <FormLayout spacing={5} alignItems="center" >
          <Typography sx={{ marginTop: 0 }} variant='h5'>Create Event</Typography>
          <Grid container justifyContent="space-around">
            <Grid textAlign="left">
              <Typography>Location</Typography>
              <TextField 
                variant="standard"
                id="location"
                label="eg: ballroom..." 
                multiline
                maxRows={4}
              />
            </Grid>
            <Grid textAlign="left">
              <Typography>Entertainment</Typography>
              <TextField
                variant="standard"
                id="entertainment"
                label="eg: yc presents..."
                multiline
                maxRows={4}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2} justifyContent="space-around">
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>From</Typography>
              <DateTimeField label="Date Time" defaultValue={dayjs(new Date())} /> 
            </Grid>
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>To</Typography>
              <DateTimeField label="Date Time" defaultValue={dayjs(new Date())} />
            </Grid>
          </Grid>
          <ImageUploadField />
          <Grid container direction="row" spacing={2} justifyContent="space-around">
            <Typography sx={{marginBottom: 2}}>
              Add special hours if the yacht clubs regular hours will be different. (optional)
            </Typography>
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>From</Typography>
              <DateTimeField label="Date Time" defaultValue={dayjs(new Date())} /> 
            </Grid>
            <Grid textAlign="left">
              <Typography sx={{marginBottom: 2}}>To</Typography>
              <DateTimeField label="Date Time" defaultValue={dayjs(new Date())} />
            </Grid>
          </Grid>
          <TextField 
            variant="standard" 
            label="Special Notes"
            multiline
            maxRows={4}
            sx={{width: '100%'}}
          />
        </FormLayout>
      </Paper>
    </>
  );
};

export default CreateYCEvent;