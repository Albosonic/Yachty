import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { Alert, Box, Button, CircularProgress, Divider, Paper, Snackbar, Stack, Typography, styled } from "@mui/material";
import { GET_RECIPROCAL_REQUESTS_BY_YC, REICPROCAL_REQEST_DATA_STRINGS, UPDATE_RECIPROCAL_REQUEST } from "@/pages/yachty/reciprocal_requests/reciprocalReviewgql";
import { Pending } from "@mui/icons-material";

const MemberRequests = () => {
  const router = useRouter();
  const ycId = router.query.ycId;
  const { data, loading, error, refetch } = useQuery(GET_RECIPROCAL_REQUESTS_BY_YC, { variables : { ycId: router.query.ycId }});
  const [updateRequest, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_RECIPROCAL_REQUEST);
  const [snackBarContent, setSnackBarMsg] = useState({msg: 'Member Approved', type: 'success'});
  const [showSuccess, setShowSuccess] = useState(false);
  const { APPROVED, DENIED, PENDING } = REICPROCAL_REQEST_DATA_STRINGS;
  const handleClose = () => console.log('closed')
  // router.push({pathname: 'yachty/reciprocal_requests/create_letter', query: { reqId: id }})}
  const handleApproveMemberRequest = (id, visitingYCId) => {
    console.log('approved ===', APPROVED)
    router.push({pathname: '/yachty/reciprocal_requests/create_letter', query: {reqid: id}})
    router.push({pathname: '/yachty/reciprocal_requests/create_letter', query: {visiting_yc_id: visitingYCId}})
    // updateRequest({variables: {id, status: APPROVED}}); 
    // refetch();
  }

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
        <Box>
          <Stack spacing={2} alignItems="center" divider={<Divider orientation="horizontal" width="400px"/>}>
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
              <Typography spacing={2} variant="h2">Reciprocal Requests</Typography>
              <Typography spacing={2} variant="h4">Your members requesting to visit other clubs</Typography>
              <Button variant="outlined" onClick={() => router.push({ pathname: '/yachty/reciprocal_requests/visitors', query: {ycId} })}>see visitor requests</Button>
            </div>
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
                  yachtClubByYachtClub: homeClub
                }
              } = req;

              if (status === DENIED) return null;
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
                      onClick={() => handleApproveMemberRequest(id, visitingYCId)}
                    >
                      Create Letter
                    </Button>
                    <Button color="error"
                      variant="outlined"
                      onClick={() => handleDenyMemberRequest(id)}>
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


// March 19, 2023

// To Oyster Point Yacht Club board & membership.
// I am writing to let you know that Ryan Opfer is a member in good standing at the Benicia Yacht
// Club. I can vouch for him personally. Any questions, please feel free to phone or text me.
// Best regards,
// Dena Stults
// Commodore
// Benicia Yacht Club
// 707 208-4498