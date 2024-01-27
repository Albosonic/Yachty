import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, Fab, Grid, Stack, TextField, Typography } from '@mui/material';
import { gql, useMutation, useQuery } from '@apollo/client';
import LoadingYachty from './LoadingYachty';


// TODO:
// mutation MyMutation {
//   insert_race_chairs_one(object: {memberId: "f2b2d02e-df1a-49a7-97c9-3b8d589abb68", ycId: "97ead1a2-9702-4a18-bf2d-6c1f3be3a919"}) {
//     yc_member {
//       firstName
//     }
//     yacht_club {
//       name
//     }
//   }
// }

const GET_RACE_CHAIR_AND_COMMENTARY = gql`
  query getRaceChairAndId($raceId: uuid) {
  races(where: {id: {_eq: $raceId}}) {
    commentary
    yacht_club {
      race_chairs {
        yc_member {
          name
          profilePic
        }
      }
    }
  }
}`;

const UPDATE_COMMENTARY = gql`
mutation updateCommentary($raceId: uuid!, $commentary: String!) {
  update_races(where: {id: {_eq: $raceId}}, _set: {commentary: $commentary}) {
    returning {
      commentary
    }
  }
}`;

const CommentsFromChairDialog = ({ setOpenDialog, open, raceId }) => {
  const logo = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const memberId = useSelector(state => state.auth.member.id);
  const [summary, setSummary] = useState('');
  const [updateString, setUpdateString] = useState('');
  const [editing, setEditing] = useState(false);
  const {error, loading, data, refetch} = useQuery(GET_RACE_CHAIR_AND_COMMENTARY, { variables: { raceId }, fetchPolicy: 'no-cache'});
  const [updateRaceCommentary, {loading: upsertLoading}] = useMutation(UPDATE_COMMENTARY);

  useEffect(() => {
    if (!loading) {
      const commentary = data.races[0]?.commentary;
      setEditing(!commentary);
      if (commentary) {
        setSummary(commentary);
        setUpdateString(commentary);
      }
    }
  },[data]);

  if (loading) return <CircularProgress />;  
  const { commentary, yacht_club: { race_chairs }} = data.races[0];
  const raceChair = race_chairs[0];
  // const { yc_member: { name, profilePic }} = race_chairs[0];

  const updateRaceSummary = async () => {
    const resp = await updateRaceCommentary({variables: { commentary: summary, raceId }});
    await refetch();
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={open}
      onClose={() => setOpenDialog(false)}
    >
      <DialogContent>
        <Grid alignContent="center">
          <Grid container justifyContent="space-between">
            <Box
              component="img"
              sx={{
                height: 90,
                width: 120,
                marginBottom: 10,
              }}
              alt="race chair photo"
              src={logo}
            />
            <Typography sx={{ lineHeight: 2 }} variant='h6'>{raceChair?.name}</Typography>
            <Avatar src={raceChair?.profilePic} aria-label='race chair pic' />
          </Grid>
        </Grid>

        {editing &&
        <TextField
          autoFocus
          multiline
          minRows={4}
          margin="dense"
          id="race-chair-commentary"
          label="Comment on Race"
          type="email"
          fullWidth
          variant="standard"
          InputProps={{endAdornment: <Button sx={{alignSelf: 'flex-end'}} onClick={updateRaceSummary}>add</Button>}}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />}
        {!editing &&
          <Stack>
            <Grid container justifyContent="flex-end">
              <Button onClick={() => setEditing(true)} sx={{alignSelf: 'flex-end'}} size='small' endIcon={<EditIcon color='primary'/>}>edit</Button>
            </Grid>
            <Typography sx={{padding: 3}}>
                {commentary}
            </Typography>
          </Stack>
        }

      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>close</Button>      
      </DialogActions>
    </Dialog>
  )
}

export default CommentsFromChairDialog;
