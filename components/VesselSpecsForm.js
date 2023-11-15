import { useEffect, useState } from "react";
import { Alert, Button, Divider, FormLabel, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import { updateVesselSpecsAct } from "@/slices/actions/authActions";

const UPDATE_VESSEL_SPECS = gql`
mutation updateVesselSpecs($ownerId: uuid, $vesselName: String, $beam: Int, $draft: Int, $length: Int) {
  update_vessels(where: {ownerId: {_eq: $ownerId}}, _set: {beam: $beam, draft: $draft, length: $length, vesselName: $vesselName}) {
    affected_rows
  }
}`;

const cleanForm = {
  vesselName: '',
  draft: '',
  beam: '',
  length: '',
}

const VesselSpecsForm = () => {
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formValues, setFormValues] = useState({ ...cleanForm });
  // const [formErrors, setFormErrors] = useState({vesselNameError: false, draftError: false, lengthError: false, beamError: false});
  const vessel = useSelector(state => state.auth.member.vessels);
  const memberId = useSelector(state => state.auth.member.id);
  const [updateVesselSpecs, {loading: specsLoading}] = useMutation(UPDATE_VESSEL_SPECS);

  useEffect(() => {
    if (!vessel) return;
    const { beam, draft, length, vesselName } = vessel[0];
    setFormValues({
      vesselName,
      draft,
      length,
      beam,
    })    
  },[vessel]);

  const handleClick = async () =>{
    const {vesselName, draft, length, beam} = formValues;
    await updateVesselSpecs({variables: {ownerId: memberId, vesselName, draft, length, beam }});
    dispatch(updateVesselSpecsAct(formValues));
    setShowSuccess(true);
  }
  const handleClose = () => {
    setShowSuccess(false)
  }
  return (
    // <Paper elevation={2} sx={{padding: 2}}>
      <Stack alignItems="center">
          <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
              Success
            </Alert>
          </Snackbar>          
          <FormLabel id="radio-vessel-specs">Vessel Spec</FormLabel>
          <TextField
            required
            id="vessel-name"
            label="vessel name"
            type="name"
            variant="standard"
            value={formValues?.vesselName}
            onChange={(event) => setFormValues({...formValues, vesselName: event.target.value})}
            sx={{ m: 0, width: '40ch' }}
            multiline
          />
          <TextField
            required
            id="vessel-draft"
            label="draft"
            type="number"
            variant="standard"
            value={formValues?.draft}          
            onChange={(event) => setFormValues({...formValues, draft: event.target.value })}
            sx={{ m: 1, width: '40ch' }}
            multiline
          />
          <TextField
            required
            id="vessel-beam"
            label="beam"
            type="number"
            variant="standard"
            value={formValues?.beam}
            onChange={(event) => setFormValues({...formValues, beam: event.target.value })}
            sx={{ m: 1, width: '40ch' }}
            multiline
          />
          <TextField
            required
            id="vessel-length"
            label="length"
            type="number"
            variant="standard"
            value={formValues?.length}
            onChange={(event) => setFormValues({...formValues, length: event.target.value })}
            sx={{ width: '40ch' }}
            multiline
          />
          <Button onClick={handleClick}>Update</Button>
      </Stack>
    // </Paper>
  )
}

export default VesselSpecsForm;





