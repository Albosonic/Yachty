import { useState } from "react";
import { Button, Divider, Grid, Stack, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import UploadRaceCourse from "@/components/UploadRaceCourse";

const Racing = () => {
  const [leftPanel, setLeftPanel] = useState(true);

  return (
    <>
      <NavBar />
      <Stack alignItems="center" spacing={4}>
        {/* <Grid container justifyContent="center">
          <Typography sx={{marginTop: 3}} variant="h4">Racing</Typography>
        </Grid> */}
        <Grid 
          sx={{ borderBottom: '1px solid lightGrey', height: '70px'}} 
          container 
          flexWrap="nowrap" 
          justifyContent="space-around" 
          width="100%"
        >
          <Button fullWidth >
            Upload Course
          </Button>
          <Divider orientation="vertical" flexItem></Divider>
          <Button fullWidth >
            Create Race
          </Button>
        </Grid>
        <UploadRaceCourse />
      </Stack>
    </>
  )
}

export default Racing;