import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import NavBar from "@/components/NavBar";
import { UPDATE_YC_MEMBER_AS_RACER } from "@/lib/gqlQueries/editMemberProfilegql";
import { updateIsRacer } from "@/slices/actions/authActions";
import { FormControlLabel, FormGroup, Grid, Paper, Stack, Typography } from "@mui/material";
import YachtySwitch from "@/components/YachtySwitch";
import UpdateMemberBio from "@/components/UpdateMemberBio";
import UploadVesselImage from "@/components/UploadVesselImage";
import useLess6EditMyProfile from "@/lib/hooks/lessThan600px/useLess6EditMyProfile";
import RadioGroupHullMaterial from "@/components/RadioGroupHullMaterial";
import VesselSpecsForm from "@/components/VesselSpecsForm";
import RadioVesselType from "@/components/RadioVesselType";
import UpdateName from "@/components/UpdateName";
import EditProfilePic from "@/components/EditProfilePic";

const vessel = {
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
};

const EditMemberProfile = ({props}) => {
  const dispatch = useDispatch();
  const memberId = useSelector(state => state.auth.member?.id);
  const memberIsRacer = useSelector(state => state.auth.member?.isRacer);
  const vesselInfo = useSelector(state => state.auth?.member.vessels);
  const vesselExists = useSelector(state => !!state.auth.member.vessels[0]?.id);

  const [updateMemberRacer, {loading: updateMemberRacerLoading}] = useMutation(UPDATE_YC_MEMBER_AS_RACER);
  
  const [vesselData, setVesselData] = useState({...vessel});
  const [racerOn, setRacerOn] = useState(false);

  useEffect(() => {
    if(vesselInfo.length > 0) setVesselData({...vesselInfo[0]})
    setRacerOn(memberIsRacer);
  }, [memberIsRacer]);

  const changeIsRacer = async () => {
    const isRacer = !racerOn;
    await updateMemberRacer({variables: {memberId, isRacer}});
    dispatch(updateIsRacer(isRacer));
    setRacerOn(isRacer);
  }
  const styles = useLess6EditMyProfile();

  const { titleVariation } = styles;

  return (
    <>
    <NavBar />
      <Paper elevation={4} sx={{ padding: 5}}>        
        <Stack alignItems="center" spacing={2}>
          <Grid container justifyContent="space-between">
            <EditProfilePic />
            <FormGroup>
              <FormControlLabel
                control={<YachtySwitch onChange={() => changeIsRacer()} sx={{ m: 1 }} checked={racerOn} />}
                label="Race Profile"
              />
            </FormGroup>
          </Grid>
          <Typography sx={{margin: '0 auto', marginBottom: 2}} variant={titleVariation}>Edit Member Profile</Typography>
          <UpdateName />
          <UpdateMemberBio />          
          <UploadVesselImage />
          {vesselExists &&
            <>
              <RadioVesselType />
              <RadioGroupHullMaterial />
              <VesselSpecsForm />
            </>
          }
        </Stack>
      </Paper>
    </>
  )
}

export default EditMemberProfile;

