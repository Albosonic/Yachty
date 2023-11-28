import LinearProgress from '@mui/material/LinearProgress';
import SailingTwoToneIcon from '@mui/icons-material/SailingTwoTone';
import { Box, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export default function LoadingYachty() {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const progressRef = useRef(() => {});
  useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: '60%' }}>
      <SailingTwoToneIcon  sx={{marginLeft: progress}} color="primary" fontSize='large' />
      <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />  
    </Box>
  );
}
