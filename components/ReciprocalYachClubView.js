import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle } from "@mui/icons-material";
import AddTaskIcon from '@mui/icons-material/AddTask';
import { useMutation, useQuery } from "@apollo/client";
import { GET_YACHT_CLUB_AND_VESSEL_INFO, INSERT_RECIPROCAL_REQUEST, INSERT_RECIPROCAL_REQUEST_NEW_VESSEL } from "@/lib/gqlQueries/requestReciprocitygql";
import { Alert, CircularProgress, Snackbar, Stack, Typography, Button, TextField, Switch, Paper, Box, Grid, Icon, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import DatePicker from "./DatePicker";
import styles from '@/styles/reciprocalView.module.css';

const ReciprocalYachtClubView = () => {
  const router = useRouter();
  const member = useSelector(state => state?.auth?.member);
  const ycId = router.query.ycId;
  const { loading, error, data } = useQuery(GET_YACHT_CLUB_AND_VESSEL_INFO, { variables: { ycId, ownerId: member?.id }});
  const [insertReciprocalRequestNewVessel, {data: reciprocalData, loading: reciprocalLoadingNewVessel, error: reciprocalErrorNewVessel}] = useMutation(INSERT_RECIPROCAL_REQUEST_NEW_VESSEL);
  const [insertReciprocalRequestOwnVessel, {data: reciprocalDataOwnVessel, loading: reciprocalLoadingOwnVessel, error: reciprocalErrorOwnVessel}] = useMutation(INSERT_RECIPROCAL_REQUEST);

  const cleanForm = {
    visitDate: '',
    requestingSlip: false,
    vesselConfirmed: false,
    specialNotes: '',
    vessel: {
      vesselName: '',
      draft: undefined,
      beam: undefined,
      length: undefined,
      hullMaterial: '',
      type: '',
      id: undefined,
      insuranceCompany: '',
      insuranceNum: '',
      insuranceExpiry: ''
    }
  }

  const [showSuccess, setShowSuccess] = useState(false);
  const [showRequestSlip, setShowRequestSlip] = useState(false);
  const [usingOwnVessel, setUsingOwnVessel] = useState(true);
  const [formData, setFormData] = useState({...cleanForm});

  const handleUseOwnVessel = () => {
    setUsingOwnVessel(!usingOwnVessel);
    setFormData({...formData, vessel: { ...cleanForm.vessel }});
  }

  const handleClose = () => {
    router.push('/yachty');
    // setShowSuccess(false);
  }

  const handleSubmit = async () => {
    const { yachtClubByYachtClub: { id: homeYCId }, id: memberId } = member;
    const {
      requestingSlip,
      specialNotes,
      visitDate: visitingDate,
      vessel: {
        vesselName,
        id: vesselId,
        beam,
        draft,
        length,
        hullMaterial,
        type,
        insuranceCompany,
        insuranceExpiry,
        insuranceNum,
      }} = formData;

    if (!usingOwnVessel) {
      const unafilliatedVesselId = uuidv4();
      await insertReciprocalRequestNewVessel({
        variables: {
          homeYCId,
          memberId,
          requestingSlip,
          unafilliatedVesselId,
          visitingDate,
          visitingYCId: ycId,
          beam,
          draft,
          length,
          hullMaterial,
          specialNotes,
          type,
          vesselName,
          insuranceInfo: { no: insuranceNum, company: insuranceCompany, expires: insuranceExpiry },
        }
      }).then(resp => {
        if (!reciprocalErrorOwnVessel) setShowSuccess(true);
      })
    } else {
      await insertReciprocalRequestOwnVessel({
        variables: {
          homeYCId,
          memberId,
          requestingSlip,
          visitingDate,
          visitingYCId: ycId,
          vesselId,
          specialNotes,
        }
      }).then(resp => {
        if (!reciprocalErrorOwnVessel) setShowSuccess(true);
      })
    }
  }

  if (loading || data === undefined) return <CircularProgress />;
  if (error) return router.push('/login');
  const { vesselConfirmed } = formData;
  const { yacht_clubs, vessels } = data;
  const desiredYC = yacht_clubs[0];
  const { name, id, logo } = desiredYC;

  return (
    <Stack
      alignItems="center"
      sx={{
        overflow: "hidden",
        overflowY: "scroll",
        height: 600,
        margin: 5
      }}
    >
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Success!!
        </Alert>
      </Snackbar>
      <Box
        component="img"
        sx={{
          height: 300,
          width: 200,
        }}
        alt="The house from the offer."
        src={logo || "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/3775947f-3ada-47d6-8f78-f48e5c099e40"}
      />
      <Stack spacing={2} alignItems="center">

        <Typography variant='h6'>
          When would you like to visit { name }
        </Typography>
        <DatePicker value={formData.visitDate} onChange={(event) => setFormData({...formData, visitDate: event.target.value})} />
        <>
          <Typography variant='h6'>
            Do you need an overnight slip?
          </Typography>
          <Switch
            checked={showRequestSlip}
            onChange={() => setShowRequestSlip(!showRequestSlip)}
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
                  specialNotes
                } = profileVessel;

                const { company, no, expires } = insuranceInfo;

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
                              <AddTaskIcon onClick={() => setFormData({...formData, vessel: { ...profileVessel }, vesselConfirmed: true})} color="success" fontSize="large" />
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
                          sepcialNotes: { specialNotes || 'none' }
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
                  value={formData.vessel.vesselName}
                  onChange={(event) => setFormData({...formData, vessel: {...formData.vessel, vesselName: event.target.value }})}
                  sx={{ m: 0, width: '40ch' }}
                  required
                />
                <TextField
                  id="vessel-draft"
                  label="draft"
                  type="number"
                  variant="standard"
                  value={formData.vessel.draft}
                  onChange={(event) => setFormData({...formData, vessel: {...formData.vessel, draft: event.target.value }})}
                  sx={{ m: 1, width: '40ch' }}
                  required
                />
                <TextField
                  id="vessel-beam"
                  label="beam"
                  type="number"
                  variant="standard"
                  value={formData.vessel.beam}
                  onChange={(event) => setFormData({...formData, vessel: {...formData.vessel, beam: event.target.value }})}
                  sx={{ m: 1, width: '40ch' }}
                  required
                />
                <TextField
                  id="vessel-length"
                  label="length"
                  type="number"
                  variant="standard"
                  value={formData.vessel?.length}
                  onChange={(event) => setFormData({...formData, vessel: {...formData.vessel, length: event.target.value }})}
                  sx={{ width: '40ch' }}
                  required
                />

                <FormLabel id="radio-hull-material">Hull Material</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="radio-buttons-hull-material-label"
                  name="row-radio-buttons-hull-material-label"
                  onChange={(event) => setFormData({...formData, vessel: {...formData.vessel, hullMaterial: event.target.value }})}
                >
                  <FormControlLabel value="fiber-glass" control={<Radio />} label="Fiber Glass" />
                  <FormControlLabel value="metal" control={<Radio />} label="Metal" />
                  <FormControlLabel value="wood" control={<Radio />} label="Wood" />
                </RadioGroup>
                <FormLabel id="radio-hull-material">Vessel Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="radio-buttons-vessel-type"
                  name="row-radio-buttons-vessel-type"
                  onChange={(event) => setFormData({...formData, vessel: {...formData.vessel, type: event.target.value }})}
                >
                  <FormControlLabel value="Sail" control={<Radio />} label="Sail" />
                  <FormControlLabel value="Power" control={<Radio />} label="Power" />
                </RadioGroup>
                <TextField
                  id="vessel-insurance-provider"
                  label="vessel insurance provider"
                  type="name"
                  variant="standard"
                  value={formData.vessel?.insuranceCompany}
                  onChange={(event) => setFormData({...formData, vessel: {...formData.vessel, insuranceCompany: event.target.value}})}
                  sx={{ m: 0, width: '40ch' }}
                  required
                />
                <TextField
                  id="vessel-insurance-number"
                  label="insurance number"
                  type="text"
                  variant="standard"
                  value={formData.vessel?.insuranceNum}
                  onChange={(event) => setFormData({...formData, vessel: {...formData.vessel, insuranceNum: event.target.value}})}
                  sx={{ m: 1, width: '40ch' }}
                  required
                />
                <FormLabel id="datePicker-expiry">Expires</FormLabel>
                <DatePicker onChange={(event) => setFormData({...formData, vessel: {...formData.vessel, insuranceExpiry: event.target.value}})} />
              </Stack>
            )
          }
          </>
        )}
        <TextField
          id="special-notes"
          label="special notes"
          type="text"
          variant="standard"
          value={formData.specialNotes}
          onChange={(event) => setFormData({...formData, specialNotes: event.target.value})}
          sx={{ m: 1, width: '40ch' }}
          multiline
          minRows={3}
          maxRows={5}
        />
        <Button disabled={!formData.visitDate} variant="contained" type="submit" onClick={handleSubmit}>Submit Request</Button>
      </Stack>
    </Stack>
  );
}

export default ReciprocalYachtClubView;
