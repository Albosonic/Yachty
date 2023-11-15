import { useMediaQuery } from "@mui/material";

const useLess6EditMyProfile = () => {
  const moreThan600px = useMediaQuery('(min-width:600px)');

  const titleVariation = moreThan600px ? 'h5' : 'h6';

  return {
    titleVariation
  }
}

export default useLess6EditMyProfile;