import { HULL_MATERIALS } from "@/lib/utils/settings";
import { Button, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

const RadioGroupHullMaterial = ({ hullMaterial }) => {
  const hullTypeIndex = HULL_MATERIALS.list.indexOf(hullMaterial);
  return (
    <>
      <FormLabel id="radio-hull-material">Hull Material</FormLabel>
      <RadioGroup
        row
        aria-labelledby="radio-buttons-hull-material-label"
        name="row-radio-buttons-hull-material-label"
        defaultValue={HULL_MATERIALS.list[hullTypeIndex]}
        onChange={(event) => setVesselToParent({...formValues,  hullMaterial: event.target.value })}
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