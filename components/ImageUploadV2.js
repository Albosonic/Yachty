import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, IMG_BUCKET } from "@/lib/clients/s3-client";
import { Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import uuid4 from "uuid4";
import { UPDATE_YC_LOGO_KEY } from "@/lib/gqlQueries/logoKey";
import { resizeLetterHead, resizeYcEventPoster } from "@/lib/utils/imgResizer";
import { UPDATE_LOGO, UPDATE_PROFILE_PICTURE, UPDATE_VESSEL_IMAGE, YC_EVENT, updateLogo } from "@/slices/actions/authActions";

const ImageUploadV2 = ({ update, variables, refetch }) => {
  const router = useRouter();
  const [image, setImage] = useState({src: null, fileDatum: null, imgKey: null});
  const {fileDatum, src, imgKey} = image;
  console.log('key', imgKey)

  const handleChange = async (e) => {
    const {files} = e.target;
    const file = files[0];
    console.log('file :', file)
    let imageObject = {
      fileDatum: await resizeYcEventPoster(file),
      imgKey: uuid4(),
      src: URL.createObjectURL(file),
    }
    setImage(imageObject)
  };

  const resetForm = () => {
    setImage({src: null, fileDatum: null, imgKey: null});
  }

  const handleSubmit = async () => {
    // this should be a utility and this component sohuld be used everywhere.
    const base64Data = new Buffer.from(fileDatum.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = fileDatum.split(';')[0].split('/')[1];
    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/png${type}`
    };
    const results = await s3Client.send(new PutObjectCommand(params));

    if (results.$metadata.httpStatusCode === 200) {
      const imagePath = `${IMG_BUCKET}${imgKey}`;
      const allImages = variables?.images ? [...variables.images, imagePath] : [imagePath]
      variables.images = JSON.stringify(allImages)
      // console.log('variables :', variables)
      const resp = await update({variables})
      console.log('resp ======', resp)
      await refetch()
      resetForm();
    } else {
      console.error('whoops :', results)
    }
  }
  
  return (
    <>
      <Stack alignItems="center">
        <Paper
          elevation={4}
          sx={{
            margin: 2,
          }}
        >
          {!src &&
            <input
              onChange={(e) => handleChange(e)}
              type="file"
              id="fileUpload"
              accept=".jpg, .jpeg, .png"
              style={{                
                // backgroundSize: "600px 400px",
                // border: '2px solid green',
                width: '100%',
                maxWidth: 500,
              }}
            />
          }
          {src && (
            <img
              src={src}
              className="fit-picture max-h-96 m-4"
              alt="image to be uploaded"

            />
          )}
        </Paper>
        <Grid sx={{margin: 2}} >
          <Button variant="outlined" onClick={handleSubmit}>Submit Image</Button>
        </Grid>
      </Stack>
    </>
  )
}

export default ImageUploadV2;

