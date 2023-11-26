import { useSelector } from 'react-redux';
import { Avatar, Box, Button, CircularProgress, Dialog, DialogContent, Grid, TextField, Typography } from '@mui/material';
import { gql, useQuery } from '@apollo/client';


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

const GET_RACE_CHAIR = gql`
query getRaceChairByYcId($ycId: uuid!) {
  race_chairs(where: {ycId: {_eq: $ycId}}, ) {
    yc_member {
      profilePic
      firstName
      lastName
    }
  }
}`;

const CommentsFromChairDialog = ({setOpenDialog, open, commentary}) => {
  const logo = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const memberId = useSelector(state => state.auth.member.id);

  const {error, loading, data} = useQuery(GET_RACE_CHAIR, { variables: { ycId } });

  if (loading) return <CircularProgress />;
  const { yc_member: { profilePic, firstName, lastName } } = data.race_chairs[0];

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
            <Typography sx={{lineHeight: 2}} variant='h6'>{`${firstName} ${lastName}`}</Typography>
            <Avatar src={profilePic} aria-aria-label='race chair pic' />
          </Grid>          
        </Grid>
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
          InputProps={{endAdornment: <Button sx={{alignSelf: 'flex-end'}} onClick={() => console.log('=== build this mutation ===')}>add</Button>}}
          // value={signature}
          // onChange={(e) => setSignature(e.target.value)}
          inputProps={{
            style: {
              fontFamily: 'Shadows Into Light, cursive',
              fontSize: 24
            },
          }}
        />
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        <Button onClick={signDoc}>Sign</Button>
      </DialogActions> */}
    </Dialog>
  )
}

export default CommentsFromChairDialog;