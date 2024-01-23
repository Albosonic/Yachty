import { useState } from "react"
import { TextField } from "@mui/material"
import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { INSERT_RACE_SERIES } from "@/lib/gqlQueries/racinggql";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";

const CreateSeriesDialog = ({open, setOpen, refetch}) => {
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id)
  const [seriesName, setSeriesName] = useState('');  
  const [insertSeries, {loading: insertSeriesLoading}] = useMutation(INSERT_RACE_SERIES);

  const handleCreateRace = async () => {
    await insertSeries({
      variables: {
        seriesName, 
        ycId
      }
    })
    setOpen(false)
    refetch();
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
    >
      <DialogContent>        
        <TextField
          required
          multiline
          fullWidth
          sx={{padding: 2}}
          placeholder="Series Name..."
          variant="standard"
          value={seriesName}
          onChange={(e) => setSeriesName(e.target.value)}
          InputProps={{endAdornment: <Button onClick={ handleCreateRace }>Create</Button>}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>        
      </DialogActions>
    </Dialog>   
  )
}

export default CreateSeriesDialog;