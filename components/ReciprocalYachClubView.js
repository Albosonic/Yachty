import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Alert, CircularProgress, Snackbar, Stack, Typography, Button, TextField, Switch, Paper, Box, Grid, Icon, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import styles from '@/styles/reciprocalView.module.css';
import DatePicker from "./DatePicker";
import { GET_YACHT_CLUB_AND_VESSEL_INFO } from "@/pages/yachty/request_reciprocity/requestReciprocitygql";
import AddTaskIcon from '@mui/icons-material/AddTask';
import { CheckCircle, Label } from "@mui/icons-material";

const ReciprocalYachtClubView = () => {
  const router = useRouter();
  const member = useSelector(state => state?.auth?.member);
  const vesselOwnerId = member?.id;

  const { loading, error, data } = useQuery(GET_YACHT_CLUB_AND_VESSEL_INFO, {
    variables: {
      ycId: router.query.ycId,
      ownerId: vesselOwnerId,
    }
  });

  const cleanForm = {
    visitDate: '',
    requestingSlip: false,
    vesselConfirmed: false,
    vessel: {}
  }

  const [showRequestSlip, setShowRequestSlip] = useState(false);
  const [usingOwnVessel, setUsingOwnVessel] = useState(true);

  const handleVisitDatePicker = (event) => setFormData({...formData, visitDate: event.target.value})
  const handleExpiryDatePicker = (event) => setFormData({...formData, insuranceInfo: {...insuranceInfo, expiryDate: event.target.value}})
  const handleSlipSwitch = () => {
    setShowRequestSlip(!showRequestSlip)
    setFormData({...formData, requestingSlip: true})
  };
  const handleUseOwnVessel = () => {
    setUsingOwnVessel(!usingOwnVessel);
    setFormData({...formData, vessel: {}, vesselConfirmed: false});

  }
  const handleConfirmVessel = (vessel) => setFormData({...formData, vessel: { ...vessel }, vesselConfirmed: true});

  const handleClose = () => {
    setShowSuccess(false);
    setFormData({...cleanForm})
  }

  const handleSubmit = () => {

    console.log('submit it', formData)
  }

  const [formData, setFormData] = useState({...cleanForm});
  const [showSuccess, setShowSuccess] = useState(false);

  if (loading) return <CircularProgress />;
  if (error) return router.push('/login');

  const { yacht_clubs, vessels } = data;
  const desiredYC = yacht_clubs[0];
  const { name, id } = desiredYC;

  return (
    <div>
      <div>
        <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Success!!
          </Alert>
        </Snackbar>
      </div>
      <Stack spacing={2} alignItems="center">
        <Typography variant='h6'>
          When would you like to visit { name }
        </Typography>
        <DatePicker onChange={handleVisitDatePicker} />
        <>
          <Typography variant='h6'>
            Do you need an overnight slip?
          </Typography>
          <Switch
            checked={showRequestSlip}
            onChange={handleSlipSwitch}
            aria-label="request a slip with reciprocity"
          />
        </>
        {showRequestSlip && (
          <>
            <Typography variant='h6'>
              Use Vessel on Yachty Profile
            </Typography>
            <Switch
              checked={usingOwnVessel}
              onChange={handleUseOwnVessel}
              aria-label="request a slip with reciprocity"
            />
            {usingOwnVessel ? (
              vessels.map(profileVessel => {
                const {
                  vesselName,
                  id,
                  draft,
                  beam,
                  length,
                  hullMaterial,
                  type,
                  insuranceInfo,
                  sepcialNotes
                } = profileVessel;
                const {company, no, expires} = insuranceInfo;
                const {vesselConfirmed} = formData;
                console.log('vesselConfirmed ==', vesselConfirmed)
                return (
                  <Paper key={id}>
                    <Stack spacing={2} alignItems="center" sx={{ width: 400, p: 5 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={10}>
                        <Typography variant="h4">Vessel</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          {vesselConfirmed ? (
                            <Stack alignItems="center">
                              <Typography>confirmed</Typography>
                              <CheckCircle color="success" fontSize="large" />
                            </Stack>
                          ): (
                            <Stack alignItems="center">
                              <Typography>confirm</Typography>
                              <AddTaskIcon onClick={() => handleConfirmVessel(profileVessel)} color="success" fontSize="large" />
                            </Stack>
                          )}
                        </Grid>
                      </Grid>
                      <Stack alignItems="stretch">
                        <Typography>
                          Vessel Name: { vesselName }
                        </Typography>
                        <Typography>
                          Draft: { draft }
                        </Typography>
                        <Typography>
                          Beam: { beam }
                        </Typography>
                        <Typography>
                          Length: { length }
                        </Typography>
                        <Typography>
                          hullMaterial: { hullMaterial }
                        </Typography>
                        <Typography>
                          type: { type }
                        </Typography>
                        <Typography>
                          sepcialNotes: { sepcialNotes || 'none' }
                        </Typography>
                        <Typography>{`${company} ${no} ${expires}`}</Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                )
              })
            ) : (
              <Stack spacing={2}>
                <TextField
                  id="vessel-name"
                  label="vessel name"
                  type="name"
                  variant="standard"
                  value={formData.vessel?.vesselName}
                  onChange={(event) => setFormData({...formData, vessel: { vesselName: event.target.value }})}
                  sx={{ m: 0, width: '40ch' }}
                  required
                />
                <TextField
                  id="vessel-draft"
                  label="draft"
                  type="number"
                  variant="standard"
                  value={formData.vessel?.draft}
                  onChange={(event) => setFormData({...formData, vessel: { draft: event.target.value }})}
                  sx={{ m: 1, width: '40ch' }}
                  required
                />
                <TextField
                  id="vessel-beam"
                  label="beam"
                  type="number"
                  variant="standard"
                  value={formData.vessel?.beam}
                  onChange={(event) => setFormData({...formData, vessel: { beam: event.target.value }})}
                  sx={{ m: 1, width: '40ch' }}
                  required
                />
                <TextField
                  id="vessel-length"
                  label="length"
                  type="number"
                  variant="standard"
                  value={formData.vessel?.length}
                  onChange={(event) => setFormData({...formData, vessel: { length: event.target.value }})}
                  sx={{ width: '40ch' }}
                  required
                />
                <FormControl required>
                  <FormLabel id="radio-hull-material">Hull Material</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="radio-buttons-hull-material-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="fiber-glass" control={<Radio />} label="Fiber Glass" />
                    <FormControlLabel value="metal" control={<Radio />} label="Metal" />
                    <FormControlLabel value="wood" control={<Radio />} label="Wood" />
                  </RadioGroup>
                </FormControl>
                <TextField
                  id="vessel-insurance-provider"
                  label="vessel insurance provider"
                  type="name"
                  variant="standard"
                  value={formData.vessel?.insuranceInfo?.company}
                  onChange={(event) => setFormData({...formData, vessel: { insuranceInfo: {...insuranceInfo, company: event.target.value} }})}
                  sx={{ m: 0, width: '40ch' }}
                  required
                />
                <TextField
                  id="vessel-insurance-number"
                  label="insurance number"
                  type="text"
                  variant="standard"
                  value={formData.vessel?.insuranceInfo?.no}
                  onChange={(event) => setFormData({...formData, vessel: {...insuranceInfo, insuranceInfo: {no: event.target.value} }})}
                  sx={{ m: 1, width: '40ch' }}
                  required
                />
                <FormLabel id="datePicker-expiry">Expires</FormLabel>
                <DatePicker onChange={handleExpiryDatePicker} />
              </Stack>
            )
          }
          </>
        )}
        <div className={styles.buttonContainer}>
          <Button variant="contained" type="submit" onClick={handleSubmit}>Submit Request</Button>
        </div>
      </Stack>
    </div>
  );
}

export default ReciprocalYachtClubView;
