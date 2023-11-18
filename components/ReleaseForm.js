import { useEffect, useState } from "react";
import { Alert, Button, Divider, FormLabel, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import { updateVesselSpecsAct } from "@/slices/actions/authActions";

// const UPDATE_VESSEL_SPECS = gql`
// mutation updateVesselSpecs($ownerId: uuid, $vesselName: String, $beam: Int, $draft: Int, $length: Int) {
//   update_vessels(where: {ownerId: {_eq: $ownerId}}, _set: {beam: $beam, draft: $draft, length: $length, vesselName: $vesselName}) {
//     affected_rows
//   }
// }`;

const cleanForm = {
  vesselName: '',
  draft: '',
  beam: '',
  length: '',
}

const ReleaseForm = () => {
  const dispatch = useDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formValues, setFormValues] = useState({ ...cleanForm });
  // const [formErrors, setFormErrors] = useState({vesselNameError: false, draftError: false, lengthError: false, beamError: false});
  const vessel = useSelector(state => state.auth.member.vessels);
  const memberId = useSelector(state => state.auth.member.id);
  const [updateVesselSpecs, {loading: specsLoading}] = useMutation(UPDATE_VESSEL_SPECS);

  // useEffect(() => {
  //   if (!vessel.length === 0) return;
  //   const { beam, draft, length, vesselName } = vessel[0];
  //   setFormValues({
  //     vesselName,
  //     draft,
  //     length,
  //     beam,
  //   })    
  // },[vessel]);

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
    <Stack alignItems="center">
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Success
        </Alert>
      </Snackbar>          
      
      <PaperLetter square elevation={10}>
          <Grid alignContent="center">
            <Grid container justifyContent="space-between">              
              <Box
                component="img"
                sx={{
                  height: 90,
                  width: 120,
                  marginBottom: 10,
                }}
                alt="yacht club logo"
                src={logo}
              />
            </Grid>
            <Grid container direction="column">              
              <Typography sx={{marginTop: 2}}>
              For and in consideraEon of the Benicia Yacht Club of entry in this series, I hereby
              accept all the risks and responsibiliEes of my boat’s parEcipaEon in said regaJa
              series and waive to the fullest extent permiJed by law any and all claims I may
              have against the Benicia Yacht Club, its members, officers, commiJees, agents
              and/or employees arising out of or in any way connected to such parEcipaEon. I
              agree to abide by The Racing Rules of Sailing and the House Rules of the Benicia
              Yacht Club. I further expressly agree the foregoing release and waiver is intended
              to be as broad and inclusive as is permiJed by law and that if any porEon, clause
              or sub-clause hereof is held invalid, it is agreed that the balance shall,
              notwithstanding, conEnue in full force and effect. I have carefully read this
              agreement and fully understand its contents. I am aware that this is a release of
              liability and waiver of claims and sign it of my free will.
              </Typography>              
              
            </Grid>
          </Grid>
        
      </PaperLetter>




      <Button onClick={handleClick}>Update</Button>
    </Stack>
  )
}

export default ReleaseForm;





