import NavBar from "@/components/NavBar";
import RaceReviewPoster from "@/components/makenewRace/RaceReviewPoster"
import { Grid, Stack } from "@mui/material";

const RacePreviewReview = () => {
  return (
    <>
      <NavBar />        
        <Grid
          container
          direction="column"
          alignItems="center"
          width="100%"          
          padding={5}
        >
          <RaceReviewPoster />
        </Grid>             
    </>
  )
}

export default RacePreviewReview;