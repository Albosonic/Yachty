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

const ImageUploadField = ({ type, setImageObjToParent, img, title="Upload Burgee" }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [image, setImage] = useState(img || {src: null,fileDatum: null,imgKey: null});
  const [imgEntered, setImgEntered] = useState(false);
  const {fileDatum, src, imgKey} = image;

  const [setLogoKey, {error, loading, data}] = useMutation(UPDATE_YC_LOGO_KEY, {
    variables: {
      ycId: router.query.ycId,
      logo: `${IMG_BUCKET}${imgKey}`,
    }
  });
  
  const handleChange = async (e) => {
    const {files} = e.target;
    const file = files[0];
    let imageObject = {
      fileDatum: file,
      imgKey: uuid4(),
      src: URL.createObjectURL(file),
    }
    //TODO: refactor all image uploads to handle their own redux operations.
    switch(type) {
      case UPDATE_PROFILE_PICTURE: {
        const resizedFile = await resizeYcEventPoster(file);
        imageObject.fileDatum = resizedFile;
        setImageObjToParent(imageObject);
      }
      case UPDATE_VESSEL_IMAGE: {
        const resizedFile = await resizeYcEventPoster(file);
        imageObject.fileDatum = resizedFile;
        setImageObjToParent(imageObject);
      }
      case YC_EVENT: {
        const resizedFile = await resizeYcEventPoster(file);
        imageObject.fileDatum = resizedFile;
        setImageObjToParent(imageObject);
      }
      case UPDATE_LOGO: {
        resizeLetterHead(file, (uri) => {
          imageObject.fileDatum = uri;
          setImage(imageObject);
        });
      }
    }
    setImgEntered(true);
  };

  const resetForm = () => {
    setImgEntered(false);
    setImage({src: null, fileDatum: null, imgKey: null});
  }

  const handleSubmit = async () => {
    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: fileDatum,
      ContentType: 'image/png'
    };
    const results = await s3Client.send(new PutObjectCommand(params));
    if (results.$metadata.httpStatusCode === 200) {
      setLogoKey();
      resetForm();
      dispatch(updateLogo(`${IMG_BUCKET}${imgKey}`))
    } else {
      console.error('whoops :', results)
    }
  }
  const inputStyle = src ? { background: `url(${src}) no-repeat`, backgroundSize: "600px 400px" } : {};
  return (
    <>      
      <Stack alignItems="center">
        <Typography variant="h6" sx={{margin: 5}}>{title}</Typography>
        <Paper elevation={4}>
          <input 
            onChange={(e) => handleChange(e)}
            type="file" 
            id="fileUpload" 
            accept=".jpg, .jpeg, .png"
            style={{
              ...inputStyle, 
              // border: '2px solid green',
              width: '100%',
              maxWidth: 500,
            }}
          />
        </Paper>
        <Grid sx={{margin: 2}} >
          {!setImageObjToParent && <Button variant="outlined" onClick={handleSubmit}>Submit Image</Button>}
        </Grid>      
      </Stack>
    </>
  )
}

export default ImageUploadField;