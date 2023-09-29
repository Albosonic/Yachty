import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Alert, Box, Button, CircularProgress, Divider, Paper, Snackbar, Stack, Typography, styled } from "@mui/material";
import { GET_RECIPROCAL_AWAITING_RESPONSE } from "@/pages/yachty/reciprocal_requests/reciprocalReviewgql";
import LetterOfReciprocity from "./LetterOfReciprocity";

const VisitingMemberRequests = () => {
  const router = useRouter();
  const ycId = router.query.ycId;
  const { data, loading, error } = useQuery(GET_RECIPROCAL_AWAITING_RESPONSE, { variables : { visitingYCId: ycId }});

  const [snackBarContent, setSnackBarMsg] = useState({msg: 'Member Approved', type: 'success'});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClose = () => console.log('closed')

  const Item = styled(Paper)(({ theme }) => ({
    color: theme.palette.text.secondary,
    maxWidth: 400,
  }));

  if (loading) return <CircularProgress />
  if (data === undefined) return (
    <Stack spacing={2} alignItems="center" divider={<Divider orientation="horizontal" width="400px"/>}>
      <Typography variant="h4">no request letters at this time</Typography>
    </Stack>
  )
  const { reciprocal_request: requests } = data;
  return (
    <>
      {
        <Box>
          <Stack spacing={2} alignItems="center">
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
              <Typography spacing={2} variant="h2">Reciprocal Requests</Typography>
              <Typography spacing={2} variant="h4">MEMBERS VISITING YOUR CLUB</Typography>
              <Button variant="outlined" onClick={() => router.replace({ pathname: '/yachty/reciprocal_requests', query: {ycId} })}>back to member requests</Button>
            </div>
            {requests.map((req, index) => {
              return (
                <Item key={`${req}${index}`}>
                  <div>
                    <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
                      <Alert onClose={handleClose} sx={{ width: '100%' }}>
                        {snackBarContent}
                      </Alert>
                    </Snackbar>
                  </div>
                  <LetterOfReciprocity reqId={req.id} awaitingResponse={true} />
                </Item>
              )
            })}
          </Stack>
        </Box>
      }
    </>
  )
}

export default VisitingMemberRequests;