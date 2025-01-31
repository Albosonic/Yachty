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
  const [image, setImage] = useState({src: null, fileDatum: null,imgKey: null});  
  const {fileDatum, src, imgKey} = image;
  
  const handleChange = async (e) => {
    const {files} = e.target;
    const file = files[0];
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
    const params = {
      Bucket: 'yachty-letter-heads',
      Key: imgKey,
      Body: fileDatum,
      ContentType: 'image/png'
    };
    const results = await s3Client.send(new PutObjectCommand(params));
    if (results.$metadata.httpStatusCode === 200) {      
      const imagePath = `${IMG_BUCKET}${imgKey}`;
      variables.images = JSON.stringify([...variables.images, imagePath])
      console.log('variables :', variables)
      await update({variables})
      await refetch()
      resetForm();
    } else {
      console.error('whoops :', results)
    }
  }
  const inputStyle = { background: `url(${src}) no-repeat`, backgroundSize: "600px 400px" }
  return (
    <>      
      <Stack alignItems="center">        
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
          <Button variant="outlined" onClick={handleSubmit}>Submit Image</Button>
        </Grid>      
      </Stack>
    </>
  )
}

export default ImageUploadV2;

