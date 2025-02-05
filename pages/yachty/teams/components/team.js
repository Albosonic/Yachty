"use client"

import { Avatar, AvatarGroup, Box, Container, Divider, Stack, Typography } from "@mui/material"
import CrewMembers from "./CrewMembers";

const images = [
  {
     src: "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/40ba3477-e5a4-42d3-9f48-d5c25d6856aa",
     width: 320,
     height: 174,
     isSelected: true,
     caption: "After Rain (Jeshu John - designerspics.com)",
  },
  {
    src: "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/40ba3477-e5a4-42d3-9f48-d5c25d6856aa",
    width: 320,
    height: 174,
    isSelected: true,
    caption: "After Rain (Jeshu John - designerspics.com)",
  },
  {
    src: "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/40ba3477-e5a4-42d3-9f48-d5c25d6856aa",
    width: 320,
    height: 174,
    isSelected: true,
    caption: "After Rain (Jeshu John - designerspics.com)",
  },
  {
    src: "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/40ba3477-e5a4-42d3-9f48-d5c25d6856aa",
    width: 320,
    height: 174,
    isSelected: true,
    caption: "After Rain (Jeshu John - designerspics.com)",
  },
  {
  src: "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/40ba3477-e5a4-42d3-9f48-d5c25d6856aa",
  width: 320,
  height: 174,
  isSelected: true,
  caption: "After Rain (Jeshu John - designerspics.com)",
  },
  {
  src: "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/40ba3477-e5a4-42d3-9f48-d5c25d6856aa",
  width: 320,
  height: 174,
  isSelected: true,
  caption: "After Rain (Jeshu John - designerspics.com)",
  },
];

const Team = ({ vessel }) => {    
    const {
      yc_member: { 
        firstName, 
        lastName, 
        profilePic 
      }, 
      vesselName, 
      id
    } = vessel
  return (
    <Box
      sx={{
        display:'flex',
        flexDirection: 'column',
        padding: 1,
      }}
    >
      <Stack className="max-w-lg" flexDirection="row"  justifyContent="space-between">
        <Stack>
          <Typography variant="h4" color="primary">{ vesselName || "UnNamed" }</Typography>
            <CrewMembers vesselId={id} />
        </Stack>

        <Stack alignItems="center">
          <Typography fontWeight="bold">
            Skipper
          </Typography>
          <img
            className="h-28 rounded-md mr-2"
            src={profilePic}
            />
          <Typography fontWeight="bold">
            {`${firstName} ${lastName}`}
          </Typography>
        </Stack>
      </Stack>
      <Typography className="max-w-lg" >
        Lorem ipsum debil magnifico lorem my dear, Lorem ipsum debil magnifico, lorem my dear Lorem ipsum debil magnifico lorem my dear
      </Typography>      
    </Box>
  )
}

export default Team