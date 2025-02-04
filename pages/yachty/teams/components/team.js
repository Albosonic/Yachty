"use client"

import { Avatar, AvatarGroup, Box, Container, Divider, Stack, Typography } from "@mui/material"

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

const Team = () => {
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
          <Typography variant="h3" color="primary">Harvest</Typography>
          <Stack flexDirection="row">
            <div className="flex flex-col" >
            <Typography  variant="h6" fontWeight="bold">crew</Typography>
            <AvatarGroup max={5}>
              {images.map((image) => {
                return (
                  <Avatar width={70} height={70} src={image.src} />
                )
              })}
            </AvatarGroup>
            </div>        
          </Stack>
        </Stack>

        <Stack alignItems="center">
          <Typography fontWeight="bold">
            Skipper
          </Typography>
          <img 
            className="h-28 rounded-md mr-2"          
            src="https://yachty-letter-heads.s3.us-west-1.amazonaws.com/40ba3477-e5a4-42d3-9f48-d5c25d6856aa" 
            />
          <Typography fontWeight="bold">
            Mitch Kessler
          </Typography>
        </Stack>
      </Stack>
      <Typography className="max-w-lg" >
        Lorem ipsum debil magnifico lorem my dear, Lorem ipsum debil magnifico, lorem my dear Lorem ipsum debil magnifico lorem my dear
      </Typography>
      <Divider />
    </Box>
  )
}

export default Team