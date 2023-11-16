import { VESSEL_TYPES } from "@/lib/utils/settings";
import { updateVesselHullMaterialAct, updateVesselTypeAct } from "@/slices/actions/authActions";
import { gql, useMutation } from "@apollo/client";
import { Alert, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar, Stack, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UPDATE_VESSEL_TYPE = gql`
  mutation updateVesselType($ownerId: uuid!, $type: String) {
  update_vessels(where: {ownerId: {_eq: $ownerId}}, _set: {type: $type}) {
    affected_rows
  }
}`;

const RadioVesselType = () => {
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const memberId = useSelector(state => state.auth.member.id);
  const vessels = useSelector(state => state.auth.member.vessels);
  const [inputVesselType, setInputVesselType] = useState('');
  const moreThan600px = useMediaQuery('(min-width:600px)');
  
  useEffect(() => {
    if (!vessels) return;
    const vesselType = vessels[0]?.type;
    console.log('vessel type :', vesselType)
    setInputVesselType(vesselType);
  }, [vessels])

  const [updateVesselType, {loading}] = useMutation(UPDATE_VESSEL_TYPE)

  const handleClick = async () => {
    await updateVesselType({variables:{ownerId: memberId, type: inputVesselType}});
    dispatch(updateVesselTypeAct(inputVesselType));
    setShowSuccess(true);
  }

  const handleClose = () => {
    setShowSuccess(false)
  }
  const toRowOrNotToRow = moreThan600px ? true : true;
  return (
    <Stack sx={{width: '100%'}} alignItems="center" spacing={2}>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Success
        </Alert>
      </Snackbar>
      <FormLabel id="radio-hull-material">Sail Type</FormLabel>
      <RadioGroup
        row={toRowOrNotToRow}
        aria-labelledby="radio-buttons-vessel-type"
        name="row-radio-buttons-vessel-type"
        value={inputVesselType}
        onChange={(e) => setInputVesselType(e.target.value)}
      >
        {VESSEL_TYPES.list.map(type => <FormControlLabel key={type} value={type} control={<Radio />} label={type} /> )}
        {moreThan600px && <Button onClick={handleClick}>update</Button>}
      </RadioGroup>
      {!moreThan600px && <Button onClick={handleClick}>update</Button>}
    </Stack>
  )
}

export default RadioVesselType;