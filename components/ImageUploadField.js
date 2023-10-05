import { useState } from "react";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Button, Grid } from "@mui/material";
import uuid4 from "uuid4";
import { s3Client } from "@/pages/s3-client";
import { useMutation } from "@apollo/client";
import { UPDATE_YC_LOGO_KEY } from "./componentsGql/imagesgql";
import { useRouter } from "next/router";
import { resizeLetterHead, resizeYcEventPoster } from "@/pages/utils/imgResizer";
import { useDispatch } from "react-redux";
import { IMG_BUCKET } from "@/pages/s3-client";
import { UPDATE_LOGO, YC_EVENT, updateLogo } from "@/slices/actions/authActions";

const ImageUploadField = ({ type, setImageObjToParent, img }) => {
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
  
  const handleChange = (e) => {
    const {files} = e.target;
    const file = files[0];
    let imageObject = {
      fileDatum: file,
      imgKey: uuid4(),
      src: URL.createObjectURL(file),
    }
    switch(type) {
      case YC_EVENT: {
        resizeYcEventPoster(file, (uri) => {
          imageObject.fileDatum = uri;
          setImageObjToParent(imageObject)
        });
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
      console.error('whoops')
    }
  }
  const inputStyle = src ? { background: `url(${src}) no-repeat`, backgroundSize: "600px 400px" } : {};
  return (
    <>
      <form encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input 
          onChange={(e) => handleChange(e)}
          type="file" 
          id="fileUpload" 
          accept=".jpg, .jpeg, .png"
          style={inputStyle}
        />
        <Grid sx={{margin: 2}} >
          {imgEntered && <Button variant="outlined" onClick={resetForm}>Edit</Button>}
          {!setImageObjToParent && <Button variant="outlined" onClick={handleSubmit}>Submit Image</Button>}
        </Grid>      
      </form>
    </>
  )
}

export default ImageUploadField;