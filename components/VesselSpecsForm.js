import { useEffect, useState } from "react";
import { Alert, Button, Divider, FormLabel, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import { updateVesselSpecsAct } from "@/slices/actions/authActions";

const UPDATE_VESSEL_SPECS = gql`
mutation updateVesselSpecs(
  $ownerId: uuid, 
  $vesselName: String, 
  $beam: Int, 
  $draft: float8, 
  $length: Int,
  $make: String,
  $model: String,
  $sailNumber: Int,
  $marina: String,
  $slip: String,
) {
  update_vessels(where: {
    ownerId: {_eq: $ownerId}}, 
    _set: {
      beam: $beam, 
      draft: $draft, 
      length: $length, 
      vesselName: $vesselName,
      make: $make,
      model: $model,
      sailNumber: $sailNumber,
      marina: $marina,
      slip: $slip,
    }) {
    affected_rows
  }
}`;

const cleanForm = {
  vesselName: '',
  draft: '',
  beam: '',
  length: '',
  make: '',
  model: '',
  sailNumber: '',
  marina: '',
  slip: '',
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
    if (!vessel.length === 0) return;
    const { beam, draft, length, vesselName, make, model, sailNumber, marina, slip } = vessel[0];
    setFormValues({
      vesselName: vesselName || '',
      draft: draft || 0,
      length: length || 0,
      beam: beam || 0,
      make: make || '',
      model: model || '',
      sailNumber: sailNumber || 0,
      marina: marina || '',
      slip: slip || '',
    })    
  },[vessel]);

  const handleClick = async () =>{
    const {vesselName, draft, length, beam, make, model, sailNumber, marina, slip} = formValues;

    // handle errors ================








    await updateVesselSpecs({
      variables: {
        ownerId: memberId, 
        vesselName, 
        draft, 
        length, 
        beam,
        make,
        model, 
        sailNumber, 
        marina,         
        slip,
      }
    });
    dispatch(updateVesselSpecsAct(formValues));
    setShowSuccess(true);
  }
  const handleClose = () => {
    setShowSuccess(false)
  }
  return (    
    <Stack alignItems="flex-start" sx={{ width: '100%', maxWidth: 600}}>
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
        sx={{  width: '40ch' }}
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
        sx={{  width: '40ch' }}
        multiline
      />
      <TextField
        required
        id="vessel-length"
        label="length"
        type="text"
        variant="standard"
        value={formValues?.length}
        onChange={(event) => setFormValues({...formValues, length: event.target.value })}
        sx={{ width: '40ch' }}
        multiline
      />
      <TextField
        required
        id="vessel-make"
        label="make"
        type="text"
        variant="standard"
        value={formValues?.make}
        onChange={(event) => setFormValues({...formValues, make: event.target.value })}
        sx={{ width: '40ch' }}
        multiline
      />
      <TextField
        required
        id="vessel-model"
        label="model"
        type="text"
        variant="standard"
        value={formValues?.model}
        onChange={(event) => setFormValues({...formValues, model: event.target.value })}
        sx={{ width: '40ch' }}
        multiline
      />
      <TextField
        required
        id="vessel-number"
        label="sail number"
        type="number"
        variant="standard"
        value={formValues?.sailNumber}
        onChange={(event) => setFormValues({...formValues, sailNumber: event.target.value })}
        sx={{ width: '40ch' }}
        multiline
      />
      <TextField
        required
        id="marina"
        label="marina"
        type="text"
        variant="standard"
        value={formValues?.marina}
        onChange={(event) => setFormValues({...formValues, marina: event.target.value })}
        sx={{ width: '40ch' }}
        multiline
      />
      <TextField
        required
        id="slip"
        label="slip"
        type="text"
        variant="standard"
        value={formValues?.slip}
        onChange={(event) => setFormValues({...formValues, slip: event.target.value })}
        sx={{ width: '40ch' }}
        multiline
      />
      <Button 
        onClick={handleClick}
        size="large"
        sx={{
          margin: 2,                    
        }} 
      >
        Update
      </Button>
    </Stack>
  )
}

export default VesselSpecsForm;





