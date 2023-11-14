import { HULL_MATERIALS } from "@/lib/utils/settings";
import { updateVesselHullMaterialAct } from "@/slices/actions/authActions";
import { gql, useMutation } from "@apollo/client";
import { Alert, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UPDATE_HULL_MATERIAL_BY_OWNER_ID = gql`
  mutation updateHullMaterial($ownerId: uuid!, $hullMaterial: String) {
  update_vessels(where: {ownerId: {_eq: $ownerId}}, _set: {hullMaterial: $hullMaterial}) {
    affected_rows
  }
}`;

// TODO: THE VESSEL DETAILS NEED TO GO THROUGH REDUX!!!!!!!!

const RadioGroupHullMaterial = () => {
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const memberId = useSelector(state => state.auth.member.id);
  const hullMaterial = useSelector(state => state.auth.member.vessels[0]?.hullMaterial)
  const [inputHullMaterial, setInputHullMaterial] = useState('');

  useEffect(() => {
    setInputHullMaterial(hullMaterial);
  }, [hullMaterial])

  const [updateVesselHullMaterial, {loading}] = useMutation(UPDATE_HULL_MATERIAL_BY_OWNER_ID)
  const updateHullMaterial = async () => {
    await updateVesselHullMaterial({variables:{ownerId: memberId, hullMaterial: inputHullMaterial}});
    dispatch(updateVesselHullMaterialAct(inputHullMaterial));
    setShowSuccess(true);
  }

  const handleClose = () => {
    setShowSuccess(false)
  }
  
  return (
    <>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Success
        </Alert>
      </Snackbar>
      <FormLabel id="radio-hull-material">Hull Material</FormLabel>
      <RadioGroup
        row
        aria-labelledby="radio-buttons-hull-material-label"
        name="row-radio-buttons-hull-material-label"
        value={inputHullMaterial}
        onChange={(e) => setInputHullMaterial(e.target.value)}
      >
        {HULL_MATERIALS.list.map(hullType => {
          return <FormControlLabel key={hullType} value={hullType} control={<Radio />} label={hullType} />
        })}
        <Button onClick={updateHullMaterial}>
          update
        </Button>
      </RadioGroup>
    </>
  )
}

export default RadioGroupHullMaterial;