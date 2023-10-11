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
};

export const resizeYcEventPoster = (file) =>
  new Promise((resolve) => {
  Resizer.imageFileResizer(
    file,
    400,
    500,
    "JPEG",
    100,
    0,
    (uri) => {
      resolve(uri);
    },
    "base64",
    200,
    200
  );
});
