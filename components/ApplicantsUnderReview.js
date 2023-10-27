import { ADD_NEW_MEMBER, DENY_MEMBERSHIP } from "@/lib/gqlQueries/addMemberGQL";
import { Alert, Box, Button, Card, CardActions, CardContent, CardMedia, Divider, Fab, Grid, Paper, Snackbar, Stack, Typography, styled } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { useRouter } from "next/router";
// San Diego CA | 11526 Sorrento Valley Rd #G-1, San Diego, CA 92121
const ApplicantsUnderReview = ({ applicants, refetch }) => {
  // TODO: need to add auth guard.
  const router = useRouter();
  const ycId = router.query.ycId;
  const [showSuccess, setShowSuccess] = useState(false);
  const [snackBarContent, setSnackBarMsg] = useState({msg: 'Member Approved', type: 'success'});

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    padding: theme.spacing(3),
    // textAlign: 'center',
    color: theme.palette.text.secondary,
    maxWidth: 400,
  }));
  
  const [ approveNewMember, {
    data: approveMemberData, 
    lodaing: approveMemberLoading, 
    error: approveMemberError,
  }] = useMutation(ADD_NEW_MEMBER);

  const [ denyMembership, {
    data: denyMemberData, 
    lodaing: denyMemberLoading, 
    error: denyMemberError,
  }] = useMutation(DENY_MEMBERSHIP);

  const handleApproveMember = (variables) => {
    console.log('wtf =============')
    setSnackBarMsg({msg: 'Member Approved', type: 'success'});
    approveNewMember(variables).then(resp => {
      if (resp.data) setShowSuccess(true);      
    });
  }

  const handleDenyMembership = (variables) => {
    setSnackBarMsg({msg: 'Membership Denied', type: 'info'});
    denyMembership(variables).then(resp => {
      if (resp.data) setShowSuccess(true);
    });
  }

  const handleClose = () => {
    setShowSuccess(false);
    refetch({ variables: { ycId } });
  }
  const { type, msg } = snackBarContent;
  return (
    <Box>
      <Stack spacing={2} alignItems="center" divider={<Divider orientation="horizontal" flexItem />}>
        {applicants.map((applicant, index) => {
          const { firstName, lastName, email, secondFirstName, secondLastName, secondEmail, profilePic, bio, referredBy } = applicant;
          const name = `${firstName} ${lastName}`;
          const secondName = `${secondFirstName} ${secondLastName}`;
          return (
            <Card key={email} sx={{ maxWidth: 345 }}>
               <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
                  <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {msg}
                  </Alert>
                </Snackbar>
              <CardActions>
                <Box display="flex" justifyContent="flex-end" sx={{ '& > :not(style)': { m: 1 }, width: '100%'}}>
                  <Fab onClick={() => {
                    handleApproveMember({
                      variables: {
                        firstName, 
                        lastName,
                        name,
                        email, 
                        secondFirstName,
                        secondLastName, 
                        secondName,
                        secondEmail,
                        ycId,
                        profilePic,
                        bio,
                      }
                    })}}
                    size="medium" color='success'  aria-label="add"
                  >
                  <AddIcon />
                  </Fab>
                </Box>
              </CardActions>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={profilePic || "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/936cec81-a508-401a-91f4-624c6f112d8f"}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {name}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  {email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bio || "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"}
                </Typography>
              </CardContent>                      
              <CardActions>
                <Grid container justifyContent="flex-end" sx={{width: '100%'}}>
                  <Button color="error"
                    variant="outlined"
                    onClick={() => handleDenyMembership({
                      variables:{email}
                    })}
                  >
                    Deny
                  </Button>
                </Grid>
              </CardActions>
            </Card>
          )
        })}
      </Stack>
    </Box>
  );
}

export default ApplicantsUnderReview;
