import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import AddIcon from '@mui/icons-material/Add';
import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Divider, Fab, Grid, List, Paper, Snackbar, Stack, Typography, styled } from "@mui/material";
import { GET_RECIPROCAL_REQUESTS_BY_YC, REICPROCAL_REQEST_DATA_STRINGS, UPDATE_RECIPROCAL_REQUEST } from "@/lib/gqlQueries/reciprocalReviewgql";

const MemberRequests = () => {
  const router = useRouter();
  const ycId = router.query.ycId;
  const [updateRequest, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_RECIPROCAL_REQUEST);
  const [snackBarContent, setSnackBarMsg] = useState({msg: 'Member Approved', type: 'success'});
  const [showSuccess, setShowSuccess] = useState(false);
  const { data, loading, error, refetch } = useQuery(GET_RECIPROCAL_REQUESTS_BY_YC, {
    variables : { ycId: router.query.ycId },
    fetchPolicy: "no-cache"
  });
  const { DENIED, AWAITING_RESPONSE } = REICPROCAL_REQEST_DATA_STRINGS;
  const handleClose = () => console.log('closed')
  const handleApproveMemberRequest = (id) => router.push({pathname: '/yachty/reciprocal_requests/create_letter', query: {reqid: id}})

  const handleDenyMemberRequest = (requestId) => {
    updateRequest(id, DENIED);
    refetch();
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
    maxWidth: 400,
  }));

  if (loading) return <CircularProgress />
  const { reciprocal_request: requests } = data;
  return (
    <>
      {
        <Box sx={{margin: 5}}>
          <Stack spacing={2} alignItems="center">
            <Typography spacing={2} variant="h2">Reciprocal Requests</Typography>
            <Typography spacing={2} variant="h4">Your members requesting to visit other clubs</Typography>
            <Button variant="outlined" onClick={() => router.push({ pathname: '/yachty/reciprocal_requests/visitors', query: {ycId} })}>see visitor requests</Button>              
                {requests.map((req, index) => {
                  const {
                    yacht_club: reciprocalClub,
                    visitingYCId,
                    visitingDate,
                    status,
                    id,
                    yc_member: {
                      active,
                      firstName,
                      lastName,
                      bio,
                      profilePic,
                      yachtClubByYachtClub: homeClub
                    }
                  } = req;

                  if (status === DENIED || status === AWAITING_RESPONSE) return null;
                  const activeMemberText = active ? {text: 'Active Member', color: "primary"} : {text:'Inactive Member', color: "secondary"};

                  return (
                    <Card sx={{ maxWidth: 345 }}>
                      <CardActions>
                        <Box display="flex" justifyContent="flex-end" sx={{ '& > :not(style)': { m: 1 }, width: '100%'}}>
                          <Fab onClick={() => handleApproveMemberRequest(id, visitingYCId)} size="medium" color='success'  aria-label="add">
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
                          {`${firstName} ${lastName}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {bio || "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"}
                        </Typography>
                      </CardContent>                      
                      <CardActions>
                        <Grid container justifyContent="flex-end" sx={{width: '100%'}}>
                          <Button color="error"
                            variant="outlined"
                            onClick={() => handleDenyMemberRequest(id)}>
                              Deny
                          </Button>
                        </Grid>
                      </CardActions>
                    </Card>
                  )
                })}
          </Stack>
        </Box>
      }
    </>
  )
}

export default MemberRequests;
