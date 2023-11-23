import { useMediaQuery } from "@mui/material";

export const usePosterStyles = () => {
  const moreThan600px = useMediaQuery('(min-width:600px)');
  const posterStyles = {
    posterWidth: moreThan600px ? 550 : 395,    
  }
  return posterStyles;
}