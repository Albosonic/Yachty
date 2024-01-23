import { useState } from "react"
import { TextField } from "@mui/material"
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';

import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import UploadRaceCourse from "@/components/UploadRaceCourse";

const CreateCourseDialog = ({open, setOpen, refetch}) => {
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id)
  const [seriesName, setSeriesName] = useState('');  
//   const [insertSeries, {loading: insertSeriesLoading}] = useMutation(INSERT_RACE_SERIES);

  const closeDialog = () => {
    refetch();
    setOpen(false);
  }

  return (
    <Dialog
      fullWidth={true}    
      open={open}
    >
      <UploadRaceCourse closeDialog={closeDialog} />
    </Dialog>   
  )
}

export default CreateCourseDialog;
