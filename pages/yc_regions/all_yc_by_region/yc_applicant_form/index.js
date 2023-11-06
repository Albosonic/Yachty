import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, CircularProgress, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { GET_NEW_MEMBER_APPLICATIONS, GET_YACHT_CLUB_BY_ID, INSERT_NEW_YC_APPLICANT } from '@/lib/gqlQueries/ycApplicantgql';
import NavBar from '@/components/NavBar';
import { clearState } from '@/slices/actions/authActions';

const YCApplicantForm = () => {
  const cleanForm = {
    firstName: '',
    lastName: '',
    primaryEmail: '',
    secondFirstName: '',
    secondLastName: '',
    secondEmail: '',
    referredBy: '',
  }
  const router =  useRouter();
  const dispatch = useDispatch();
  const yacht_club = router.query.ycid;
  const [insertNewApplicant, { loading }] = useMutation(INSERT_NEW_YC_APPLICANT);
  const applicant = useSelector(state => state.auth);
  const {loading: memAppsLoading, error: memAppsError, data: memAppsData} = useQuery(GET_NEW_MEMBER_APPLICATIONS, { variables: { email: applicant.email } });
  const {loading: ycLoading, error: ycError, data: ycData} = useQuery(GET_YACHT_CLUB_BY_ID, { variables: { ycId: yacht_club } });
  const [formData, setFormData] = useState({...cleanForm});
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    setFormData({
      ...formData,
      firstName: applicant?.given_name || '',
      lastName: applicant?.family_name || '',
      primaryEmail: applicant?.email || '',
    });
  }, [applicant])
  if (memAppsLoading || ycLoading) return <CircularProgress />;
  
  const memberApp = memAppsData.potential_members;
  const { name: ycName, logo: ycLogo } = ycData.yacht_clubs[0];

  if (memberApp.length > 0) {
    const STATUS_TEXT = memberApp[0].membershipDenied ? 'Membership Denied' : 'pending';
    return (
      <>
        <NavBar />
        <Stack spacing={2} alignItems="center">
          <Typography variant='h6'>
              Your membershipRequest has been sent current status {STATUS_TEXT}
          </Typography>
        </Stack>
      </>
    )
  }
  const { firstName, lastName, primaryEmail, secondFirstName, secondLastName, secondEmail, referredBy } = formData;

  const handleFirstName = (event) => setFormData({...formData, firstName: event.target.value})
  const handleLastName = (event) => setFormData({...formData, lastName: event.target.value})
  const handleEmail = (event) => setFormData({...formData, primaryEmail: event.target.value})
  const handleSecondFirstName = (event) => setFormData({...formData, secondFirstName: event.target.value})
  const handleSecondLastName = (event) => setFormData({...formData, secondLastName: event.target.value})
  const handleSecondEmail = (event) => setFormData({...formData, secondEmail: event.target.value})
  const handleReferredBy = (event) => setFormData({...formData, referredBy: event.target.value})

  const handleClose = () => {
    setShowSuccess(false);
    setFormData({...cleanForm});
    dispatch(clearState());
    window.location = `${window.location.origin}/api/auth/logout`;
  }

  const handleSubmit = async () => {
    const resp = await insertNewApplicant({
      variables: {
        email: primaryEmail, 
        firstName, 
        lastName, 
        secondEmail, 
        secondFirstName, 
        secondLastName, 
        referredBy, 
        yacht_club
      }
    });
    setShowSuccess(true);
  }
  
  return (
    <>
      <NavBar />
        <Stack sx={{margin: 4}} spacing={4} alignItems="center">
          <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Success!!
            </Alert>
          </Snackbar>   
          <Box
            component="img"
            sx={{
              height: 90,
              width: 120,
              margin: 20
            }}
            alt="yacht club burgee"
            src={ycLogo}
          />   
          <Stack
            sx={{
              height: 500,
              overflow: "hidden",
              overflowY: "scroll",
            }}
          >
            <Stack spacing={3} alignItems="center" sx={{marginBottom: 5}}>              
              <Typography variant='h5'>Apply for membership to { ycName }</Typography>
              <Typography alignSelf="flex-start" variant='h4'>
                Primary Member
              </Typography>
              <TextField
                multiline
                id="primary-first-name-input"
                label="first name"
                type="name"
                variant="standard"
                value={firstName}
                onChange={handleFirstName}
                sx={{ m: 1, width: '40ch' }}
                required
              />
              <TextField
                multiline
                id="primary-last-name-input"
                label="last name"
                type="name"
                variant="standard"
                value={lastName}
                onChange={handleLastName}
                sx={{ m: 1, width: '40ch' }}
                required
              />
              <TextField
                multiline
                id="primary-email-input"
                label="email"
                type="name"
                variant="standard"
                value={primaryEmail}
                onChange={handleEmail}
                sx={{ m: 1, width: '40ch' }}
                required
              />
            </Stack>
            <Stack spacing={2} alignItems="center">
              <Typography alignSelf="flex-start" variant='h4' sx={{ marginTop: 5}}>
                Secondary Member
              </Typography>
              <TextField
                multiline
                id="second-first-name-input"
                label="first name"
                type="name"
                variant="standard"
                value={secondFirstName}
                onChange={handleSecondFirstName}
                sx={{ m: 0, width: '40ch' }}
              />
              <TextField
                multiline
                id="second-last-name-input"
                label="last name"
                type="name"
                variant="standard"
                value={secondLastName}
                onChange={handleSecondLastName}
                sx={{ m: 1, width: '40ch' }}
              />
              <TextField
                multiline
                id="second-email-input"
                label="second email"
                type="name"
                variant="standard"
                value={secondEmail}
                onChange={handleSecondEmail}
                sx={{ m: 1, width: '40ch' }}
              />
              <TextField
                multiline
                id="referred-by-input"
                label="referred by"
                type="name"
                variant="standard"
                value={referredBy}
                onChange={handleReferredBy}
                sx={{ m: 1, width: '40ch' }}
              />            
            </Stack>
          </Stack>
          <Button variant="outlined" type="submit" onClick={handleSubmit}>Submit</Button>
        </Stack>
      </>
  );
}

export default YCApplicantForm;