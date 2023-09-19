import { Grid, Typography } from "@mui/material";
import ImageUploadField from "@/components/ImageUploadField";
import NavBar from "@/components/NavBar";


const EditClubProfile = () => {
  return (
    <>
      <NavBar />
      <Grid>
        <ImageUploadField />
      </Grid>
    </>
  )
}

export default EditClubProfile;