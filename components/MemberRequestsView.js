import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Alert, Box, Button, CircularProgress, Divider, Paper, Snackbar, Stack, Typography, styled } from "@mui/material";
import NavBar from '@/components/NavBar';
import { GET_RECIPROCAL_REQUESTS_BY_YC } from "@/pages/yachty/reciprocal_requests/reciprocalReviewgql";


// if user

const MemberRequests = () => {
  const router = useRouter();
  const ycId = router.query.ycId;
  const { data, loading, error } = useQuery(GET_RECIPROCAL_REQUESTS_BY_YC, { variables : { ycId: router.query.ycId }});
  const [snackBarContent, setSnackBarMsg] = useState({msg: 'Member Approved', type: 'success'});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClose = () => console.log('closed')

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
        <Box>
          <Stack spacing={2} alignItems="center" divider={<Divider orientation="horizontal" width="400px"/>}>
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
              <Typography spacing={2} variant="h2">Reciprocal Requests</Typography>
              <Typography spacing={2} variant="h4">Your members requesting to visit other clubs</Typography>
              <Button variant="outlined" onClick={() => router.push({ pathname: '/yachty/reciprocal_requests/visitors', query: {ycId} })}>see visitor requests</Button>
            </div>
            {requests.map((req, index) => {
              console.log('req ==', req)
              const {
                yacht_club: reciprocalClub,
                visitingDate,
                yc_member: {
                  active,
                  firstName,
                  lastName,
                  yachtClubByYachtClub: homeClub
                }
              } = req;

              const activeMemberText = active ? {text: 'Active Member', color: "primary"} : {text:'Inactive Member', color: "secondary"};

              return (
                <Item key={`${req}${index}`}>
                  <div>
                    <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
                      <Alert onClose={handleClose} sx={{ width: '100%' }}>
                        {snackBarContent}
                      </Alert>
                    </Snackbar>
                  </div>
                  <Typography color={activeMemberText.color} spacing={2} variant="h4">{activeMemberText.text}</Typography>
                  <Typography spacing={2} variant="h5">{`${firstName} ${lastName}`}</Typography>
                  <Typography spacing={2} variant="h6">{`is requesting reciprocity to ${reciprocalClub.name}`}</Typography>
                  <Typography spacing={2} variant="h6">{`on: ${visitingDate}`}</Typography>
                  <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() => console.log("clicked")}
                      >
                        Send Letter
                    </Button>
                    <Button color="error"
                      variant="outlined"
                      onClick={() => console.log('clicked')}>
                        Deny
                    </Button>
                  </div>
                </Item>
              )
            })}
          </Stack>
        </Box>
      }
    </>
  )
}

export default MemberRequests;