import { FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import DatePicker from "./DatePicker";

const cleanForm = {
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

const InsertVesselForm = ({ setVesselToParent, formValues }) => {
  return (
    <>
      <Stack spacing={2}>
        <Typography>Vessel Info (optional)</Typography>
        <TextField
          id="vessel-name"
          label="vessel name"
          type="name"
          variant="standard"
          value={formValues.vesselName}
          onChange={(event) => setVesselToParent({...formValues, vesselName: event.target.value})}
          sx={{ m: 0, width: '40ch' }}
          multiline
          required
        />
        <TextField
          id="vessel-draft"
          label="draft"
          type="number"
          variant="standard"
          value={formValues.draft}          
          onChange={(event) => setVesselToParent({...formValues, draft: event.target.value })}
          sx={{ m: 1, width: '40ch' }}
          multiline
        />
        <TextField
          id="vessel-beam"
          label="beam"
          type="number"
          variant="standard"
          value={formValues.beam}
          onChange={(event) => setVesselToParent({...formValues, beam: event.target.value })}
          sx={{ m: 1, width: '40ch' }}
          multiline
        />
        <TextField
          id="vessel-length"
          label="length"
          type="number"
          variant="standard"
          value={formValues?.length}
          onChange={(event) => setVesselToParent({...formValues, length: event.target.value })}
          sx={{ width: '40ch' }}
          multiline
        />
        
        <FormLabel id="radio-hull-material">Hull Material</FormLabel>
        <RadioGroup
          row
          aria-labelledby="radio-buttons-hull-material-label"
          name="row-radio-buttons-hull-material-label"
          onChange={(event) => setVesselToParent({...formValues,  hullMaterial: event.target.value })}
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
          onChange={(event) => setVesselToParent({...formValues, type: event.target.value })}
        >
          <FormControlLabel value="Sail" control={<Radio />} label="Sail" />
          <FormControlLabel value="Power" control={<Radio />} label="Power" />
        </RadioGroup>
        <TextField
          id="vessel-insurance-provider"
          label="vessel insurance provider"
          type="name"
          variant="standard"
          value={formValues?.insuranceCompany}
          onChange={(event) => setVesselToParent({...formValues, insuranceCompany: event.target.value})}
          sx={{ m: 0, width: '40ch' }}
          multiline
        />
        <TextField
          id="vessel-insurance-number"
          label="insurance number"
          type="text"
          variant="standard"
          value={formValues?.insuranceNum}
          onChange={(event) => setVesselToParent({...formValues, insuranceNum: event.target.value})}
          sx={{ m: 1, width: '40ch' }}
          multiline
        />
        <FormLabel id="datePicker-expiry">Expires</FormLabel>
        <DatePicker onChange={(event) => setVesselToParent({...formValues, insuranceExpiry: event.target.value})} />
      </Stack>      
    </>
  );
}

export default InsertVesselForm;