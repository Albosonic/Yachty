"use client"
import NavBar from "@/components/NavBar"
import withAuthGaurd from "@/hocees/withAuthCusom"
import { useState } from "react";
import { Gallery } from "react-grid-gallery";
import { Button, Divider, Grid, ImageList, ImageListItem, Stack, Typography } from "@mui/material";

const images = [
  {
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    width: 320,
    height: 174,
    caption: "After Rain (Jeshu John - designerspics.com)",
  },
  {
    src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
    width: 320,
    height: 212,
    alt: "Boats (Jeshu John - designerspics.com)",
  },
  {
    src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
    width: 320,
    height: 212,
  },
  {
    src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
    width: 320,
    height: 174,
  },
];

const EventImageGallery = () => {
  const [stateFulImages, setImages] = useState(images)
  const selectImage = (i, image) => {
    const temp = structuredClone(stateFulImages)
    temp[i].isSelcted = true
    console.log('tempi :', temp[i])
    setImages(temp)

  }
  return (
    <>
      <NavBar />
      <Grid
        sx={{ borderBottom: '1px solid lightGrey', height: '70px' }}
        container
        flexWrap="nowrap"
        justifyContent="space-around"
        width="100%"
      >
        <Button sx={{ borderRadius: 0 }} fullWidth>gallery</Button>
        <Divider orientation="vertical" flexItem></Divider>
        <Button sx={{ borderRadius: 0 }} fullWidth>add photo</Button>
        <Divider orientation="vertical" flexItem></Divider>
      </Grid>      
      <div className="flex justify-center" >
        <ImageList sx={{ width: 500, height: 450 }} cols={4} rowHeight={150}>
          {images.map((item) => (
            <ImageListItem key={item.src}>
              <img        
                srcSet={`${item.src}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.src}?w=164&h=164&fit=crop&auto=format`}
                alt={item.alt}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>      
      </div>
    </>
  )
}

export default withAuthGaurd(EventImageGallery)