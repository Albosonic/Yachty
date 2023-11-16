import { useState } from "react";
import { Button, Divider, Grid, Stack, Typography } from "@mui/material";
import NavBar from "@/components/NavBar";
import UploadRaceCourse from "@/components/UploadRaceCourse";
import UploadRaceEvent from "@/components/UploadRaceEvent";

const CreateRaces = () => {
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const left = showLeftPanel ? 1.5 : 1;
  const right = showLeftPanel ? 1 : 1.5;
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
          <Button sx={{borderBottom: left, borderRadius:0 }} fullWidth onClick={() => setShowLeftPanel(true)}>
            Upload Course
          </Button>
          <Divider orientation="vertical" flexItem></Divider>
          <Button sx={{borderBottom: right, borderRadius:0 }} fullWidth onClick={() => setShowLeftPanel(false)}>
            Create Race
          </Button>
        </Grid>
        {showLeftPanel ? <UploadRaceCourse /> : <UploadRaceEvent />}
      </Stack>
    </>
  )
}

export default CreateRaces;