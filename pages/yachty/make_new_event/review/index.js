import NavBar from "@/components/NavBar";
import EventReviewPoster from "@/components/makenewEvent/EventReviewPoster";
import { Grid } from "@mui/material";

const EventPreviewReview = () => {
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
        <EventReviewPoster />
      </Grid>
    </>
  )
}

export default EventPreviewReview;