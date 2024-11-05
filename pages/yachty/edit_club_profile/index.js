import { Grid, Typography } from "@mui/material";
import ImageUploadField from "@/components/ImageUploadField";
import NavBar from "@/components/NavBar";
import { UPDATE_LOGO } from "@/slices/actions/authActions";
import withAuthGaurd from "@/hocees/withAuthCusom";


const EditClubProfile = () => {
  return (
    <>
      <NavBar />
      <Grid>
        <ImageUploadField type={UPDATE_LOGO} />
      </Grid>
    </>
  )
}

export default withAuthGaurd(EditClubProfile);