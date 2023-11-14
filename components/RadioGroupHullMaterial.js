import { HULL_MATERIALS } from "@/lib/utils/settings";
import { useMutation } from "@apollo/client";
import { Button, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

const UPDATE_HULL_MATERIAL_BY_OWNER_ID = gql`
  mutation updateHullMaterial($ownerId: uuid!, $hullMaterial: String) {
  update_vessels(where: {ownerId: {_eq: $ownerId}}, _set: {hullMaterial: $hullMaterial}) {
    affected_rows
  }
}`;




const RadioGroupHullMaterial = ({ hullMaterial }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const memberId = useSelector(state => state.auth.member.id);
  // const [hullMaterial, setHullMaterial] = useState() TODO!!!!
  const [updateVesselHullMaterial, {loading}] = useMutation(UPDATE_HULL_MATERIAL_BY_OWNER_ID)

  const handlehullMaterialUpdate = () => {
    await updateHullMaterial({variables:{ownerId: memberId})
  
  }

  const hullTypeIndex = HULL_MATERIALS.list.indexOf(hullMaterial);
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
        defaultValue={HULL_MATERIALS.list[hullTypeIndex]}
        onChange={() => }
      >
        {HULL_MATERIALS.list.map(hullType => {
          return <FormControlLabel value={hullType} control={<Radio />} label={hullType} />
        })}
        <Button>
          update
        </Button>
      </RadioGroup>
    </>
  )
}

export default RadioGroupHullMaterial;