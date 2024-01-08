import Resizer from "react-image-file-resizer";
import { resolve } from "styled-jsx/css";

export const resizeLetterHead = (file, callBack) => {
  try {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "PNG",
      100,
      0,
      callBack,
      "file",
      200,
      200
    );
  } catch (err) {
    console.log(err);
  }
};

const EventposterConfig = {
  newWidth: 150,
  newHeight: 200,
  minWidth: 100,
  minHeight: 100,
  fileType: 'PNG',
  quality: 100,
  rotation: 0,
  outPutType: "base64",
  minWidth: 100,
  minHeight: 100,
}

export const resizeYcEventPoster = (file) => {
  return new Promise((resolve) => {
    const {newWidth, newHeight, minWidth, minHeight, fileType, quality, rotation, outPutType} = EventposterConfig;
    return Resizer.imageFileResizer(
      file,
      newWidth,
      newHeight,
      fileType,
      quality,
      rotation,
      (resizedFile) => {
        resolve(resizedFile);
      },
      outPutType,
      minWidth,
      minHeight
    );
  })
}
