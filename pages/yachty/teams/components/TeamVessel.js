import { Typography } from "@mui/material"
import { Stack } from "@mui/system"

const TeamVessel = () => {
  return (
    <Stack
      padding={2}
      flexDirection="row"
      className="justify-start border w-screen"      
    >
      <img
        className="w-60 rounded mr-10"
        src="https://yachty-letter-heads.s3.us-west-1.amazonaws.com/fcc20053-61fc-4223-8430-46c805adf418"
      />
      <Stack>
        <Typography variant="h5" >
          About:
        </Typography>
        <Typography className="max-w-96">
          Lorem ipsum in paris is the way. Go down the road and turn left onto the the side, then get some impsu lorem to do Lorem ipsum in paris is the way. Go down the road and turn left onto the the side, then get some impsu lorem to do
        </Typography>
      </Stack>
    </Stack>
  )
}

export default TeamVessel