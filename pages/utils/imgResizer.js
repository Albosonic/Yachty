import Resizer from "react-image-file-resizer";

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
}