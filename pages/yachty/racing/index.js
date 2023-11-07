import { useState } from "react";
import { Button, Divider, Grid, Stack, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import UploadRaceCourse from "@/components/UploadRaceCourse";
import UploadRaceEvent from "@/components/UploadRaceEvent";

const Racing = () => {
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  
  return (
    <>
      <NavBar />
      <Stack alignItems="center" spacing={4}>
        <Grid 
          sx={{ borderBottom: '1px solid lightGrey', height: '70px'}} 
          container 
          flexWrap="nowrap" 
          justifyContent="space-around" 
          width="100%"
        >
          <Button fullWidth onClick={() => setShowLeftPanel(!showLeftPanel)}>
            Upload Course
          </Button>
          <Divider orientation="vertical" flexItem></Divider>
          <Button fullWidth onClick={() => setShowLeftPanel(!showLeftPanel)}>
            Create Race
          </Button>
        </Grid>
        {showLeftPanel ? <UploadRaceCourse /> : <UploadRaceEvent />}
      </Stack>
    </>
  )
}

export default Racing;