import { Button, Grid, Stack, Typography } from "@mui/material";

const RaceDetail = ({ detail, label }) => {
  return (
    <Stack width="100%" margin={1}>
      <Typography variant="h5">{label}</Typography>
      <Grid container>
      <Typography variant="h6">{detail}</Typography>
        <Button>edit</Button>
      </Grid>
    </Stack>
  )
}

export default RaceDetail;