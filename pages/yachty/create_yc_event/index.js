import NavBar from '@/components/NavBar';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { INSERT_YC_EVENT } from './createYCEventgql';
import ImageUploadField from '@/components/ImageUploadField';
import { useMutation } from '@apollo/client';

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
  return (
    <>
    <NavBar />
      <Stack spacing={10} alignItems="center" >
        <Typography variant='h5'>Create Event</Typography>
          <ImageUploadField />
      </Stack>
    </>
  );
};

export default CreateYCEvent;