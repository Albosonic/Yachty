import NavBar from "@/components/NavBar";
import EastIcon from '@mui/icons-material/East';
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";


const makeNewRace = () => {
  return (
    <>
      <NavBar />
      <Grid
        container         
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '70vh' }}
      >
        <Stack spacing={2}>
          <Grid container justifyContent="space-around">
            <Typography variant="h4">Enter Race Name</Typography>
            <Button endIcon={<EastIcon />}>next</Button>
          </Grid>
          <TextField
            multiline
            fullWidth          
            label="race name"
            variant="standard"
          />
        </Stack>
      </Grid>
    </>

  )
}

export default makeNewRace;