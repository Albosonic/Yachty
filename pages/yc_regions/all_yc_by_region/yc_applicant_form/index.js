import { Alert, Box, Button, CircularProgress, Snackbar, Stack, TextField, Typography, setRef } from '@mui/material';
import NavBar from '@/components/NavBar';
import styles from '@/styles/ycApplicantForm.module.css'
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_NEW_MEMBER_APPLICATIONS, INSERT_NEW_YC_APPLICANT } from './ycApplicantgql';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

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
  const [insertNewApplicant, { data, loading, error }] = useMutation(INSERT_NEW_YC_APPLICANT);
  const applicant = useSelector(state => state.auth);
  const {loading: memAppsLoading, error: memAppsError, data: memAppsData} = useQuery(GET_NEW_MEMBER_APPLICATIONS, { variables: { email: applicant.email } });
  const [formData, setFormData] = useState({...cleanForm});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const yacht_club = router.query.ycid;

  useEffect(() => {
    setFormData({
      ...formData,
      firstName: applicant?.given_name || '',
      lastName: applicant?.family_name || '',
      primaryEmail: applicant?.email || '',
    });
  }, [applicant])
  if (memAppsLoading) return <CircularProgress />;

  const memberApp = memAppsData.potential_members;
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
    window.location = "/api/auth/logout";
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
  
  const yachClubName = router.query.ycname;
  return (
    <div>
      <NavBar />
        <div>
          <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Success!!
            </Alert>
          </Snackbar>
        </div>
        <Stack spacing={2} alignItems="center">
          <Typography variant='h6'>Apply for membership to {yachClubName}</Typography>
          <Typography variant='h4'>
            Primary Member
          </Typography>
          <TextField
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
          <Typography variant='h4' sx={{ mb: 0, mt:3}}>
            Secondary Member
          </Typography>
          <TextField
            id="second-first-name-input"
            label="first name"
            type="name"
            variant="standard"
            value={secondFirstName}
            onChange={handleSecondFirstName}
            sx={{ m: 0, width: '40ch' }}
          />
          <TextField
            id="second-last-name-input"
            label="last name"
            type="name"
            variant="standard"
            value={secondLastName}
            onChange={handleSecondLastName}
            sx={{ m: 1, width: '40ch' }}
          />
          <TextField
            id="second-email-input"
            label="second email"
            type="name"
            variant="standard"
            value={secondEmail}
            onChange={handleSecondEmail}
            sx={{ m: 1, width: '40ch' }}
          />
          <TextField
            id="referred-by-input"
            label="referred by"
            type="name"
            variant="standard"
            value={referredBy}
            onChange={handleReferredBy}
            sx={{ m: 1, width: '40ch' }}
          />
          <div className={styles.buttonContainer}>
            <Button variant="outlined" type="submit" onClick={handleSubmit}>Submit</Button>
          </div>
        </Stack>
      </div>
  );
}

export default YCApplicantForm;