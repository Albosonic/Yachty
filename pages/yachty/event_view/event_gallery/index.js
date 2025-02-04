"use client"
import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar"
import { Button, Divider, Grid, ImageList, ImageListItem, Stack, Typography } from "@mui/material";
import withAuthGaurd from "@/hocees/withAuthCusom"
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import ImageUploadV2 from "@/components/ImageUploadV2";
import LoadingYachty from "@/components/LoadingYachty";

const GET_EVENT_GALLERY = gql`
  query getGallery($id: uuid!) {
  yc_events(where: {id: {_eq: $id}}) {
    images
  }
}
`
// TODO make sure this is working and !!!
const UPDATE_EVENT_GALLERY = gql`
  mutation updateGallery($id: uuid!, $images: jsonb!) {
  update_yc_events(where: {id: {_eq: $id}}, _set: {images: $images}) {
    returning {
      images
    }
  }
}
`

// const images = [
//   {
//     src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
//     width: 320,
//     height: 174,
//     caption: "After Rain (Jeshu John - designerspics.com)",
//   },
//   {
//     src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
//     width: 320,
//     height: 212,
//     alt: "Boats (Jeshu John - designerspics.com)",
//   },
//   {
//     src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
//     width: 320,
//     height: 212,
//   },
//   {
//     src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
//     width: 320,
//     height: 174,
//   },
// ];

const EventImageGallery = () => {
  const router = useRouter()
  const eventId = router.query.eventId
  const { error, loading, data, refetch } = useQuery(GET_EVENT_GALLERY, { variables: { id: eventId } })
  const [updateEventGallery] = useMutation(UPDATE_EVENT_GALLERY)
  const [images, setImages] = useState(null)
  const [addPhoto, setAddPhoto] = useState(false)

  const selectImage = (item) => {

  }

  // const images = data?.yc_events[0]?.images || []

  useEffect(() => {
    // console.log('wtf ======', loading)
    if (!data || error, loading) return
    const imgResp = data.yc_events[0].images
    if (!imgResp) setAddPhoto(true)
      // console.log('imgResp :', imgResp)
    setImages(JSON.parse(imgResp))
  }, [data])

  if (loading || !data || error) return <LoadingYachty />

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
        <Button onClick={() => setAddPhoto(false)} sx={{ borderRadius: 0 }} fullWidth>gallery</Button>
        <Divider orientation="vertical" flexItem></Divider>
        <Button onClick={() => setAddPhoto(true)} sx={{ borderRadius: 0 }} fullWidth>add photo</Button>
        <Divider orientation="vertical" flexItem></Divider>
      </Grid>
      {!addPhoto && (
        <div className="flex justify-center p-4" >
          <ImageList sx={{ width: 500, height: 450 }} cols={4} rowHeight={150}>
            { images && images.map((item) => {
              console.log('item :', item)
              return (
              <ImageListItem key={item}>
                <img
                  onClick={() => selectImage(item)}
                  srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item}?w=164&h=164&fit=crop&auto=format`}
                  alt="gallery image"
                  loading="lazy"
                />
              </ImageListItem>
            )
          })}
          </ImageList>
        </div>
      )}
      {addPhoto && (
        <ImageUploadV2 update={updateEventGallery} variables={{id: eventId, images}} refetch={refetch} />
      )}
    </>
  )
}

export default withAuthGaurd(EventImageGallery)