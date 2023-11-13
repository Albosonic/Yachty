import { gql, useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Alert, Box, Button, CircularProgress, Grid, Paper, Snackbar, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState } from "react";
import { REICPROCAL_REQEST_DATA_STRINGS } from "@/lib/gqlQueries/reciprocalReviewgql";

const GET_RECIPROCAL_REQUEST = gql`
  query getReciprocalRequest($reqId: uuid) {
    reciprocal_request(where: {id: {_eq: $reqId}}) {
      visitingDate
      yc_member {
        name
      }
      yacht_club {
        name
        commodore {
          name
        }
      }
      yachtClubByHomeycid {
        name
        commodore {
          name
          yc_member {
            name
          }
        }
      }
    }
  }
`;

const UPDATE_RECIPROCAL_STATUS = gql`
  mutation updateReciprocalStatus($id: uuid, $letterSent: date, $status: String) {
  update_reciprocal_request(where: {id: {_eq: $id}}, _set: {letterSent: $letterSent, status: $status}) {
    affected_rows
  }
}`;

const PaperLetter = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '100%',
  maxWidth: 500,
  maxHeight: 800,
  padding: 20,

}));


const LetterOfReciprocity = ({ reqId, awaitingResponse }) => {
  const router = useRouter();
  const logo = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const [snackBarContent, setSnackBarMsg] = useState({msg: 'Member Approved', type: 'success'});
  const [showSuccess, setShowSuccess] = useState(false);
  let letterDate = new Date().toDateString();
  const [updateReciprocalStatus, {data: mutData, loading: mutLoading, error: muteError }] = useMutation(UPDATE_RECIPROCAL_STATUS, {
    variables: {
      id: reqId,
      letterSent: letterDate,
      status: REICPROCAL_REQEST_DATA_STRINGS.AWAITING_RESPONSE,
    }
  });
  const {data, loading, error} = useQuery(GET_RECIPROCAL_REQUEST, {
    variables: {
      reqId
    }
  });
  const handleSendLetter = async () => {
    console.log('id :', reqId)
    console.log('string :', letterDate)
    await updateReciprocalStatus();
    setShowSuccess(true);
  }
  const handleClose = () => router.back();

  const handleApprove = () => {
    console.log('approve')
  }

  const handleDeny = () => {
    console.log('deny')
  }


  if (loading || !data) return <CircularProgress />
  const { 
    visitingDate, 
    yc_member: { name: memberName },
    yacht_club: { name: visitingYachtClub },
    yachtClubByHomeycid: {name: yachtClubName, commodore: { name: commodoereName } }  
  } = data.reciprocal_request[0];

  return (
    <>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} sx={{ width: '100%' }}>
          {snackBarContent.msg}
        </Alert>
      </Snackbar>
      <PaperLetter square elevation={10}>
          <Grid alignContent="center">
            <Grid container justifyContent="space-between">
              <Typography sx={{lineHeight: 10}}>
                { letterDate }
              </Typography>
              <Box
                component="img"
                sx={{
                  height: 90,
                  width: 120,
                  marginBottom: 10,
                }}
                alt="yacht club logo"
                src={logo}
              />
            </Grid>
            <Grid container direction="column">
              <Typography sx={{marginTop: 2}}>
                To { visitingYachtClub } Yacht Club board & membership.
              </Typography>
              <Typography sx={{marginTop: 2}}>
                I am writing to let you know that { memberName } is a member in good standing at the { yachtClubName } Yacht
                Club. I can vouch for him personally. Any questions, please feel free to phone or text me.
                Best regards,
              </Typography>
              <Typography sx={{marginTop: 2}}>
                Commodore { commodoereName }
              </Typography>
              <Grid container justifyContent="space-between">
                <Typography sx={{marginTop: 2}}>
                  707 208-4498
                </Typography>
                {!awaitingResponse && <Button onClick={handleSendLetter}>Send Letter</Button>}
                {awaitingResponse && (
                  <>
                    <Button onClick={handleApprove}>Approve</Button>
                    <Button onClick={handleDeny}>Deny</Button>
                  </>
                  )
                }

                
              </Grid>
            </Grid>
          </Grid>
        
      </PaperLetter>
    </>
  )
};

export default LetterOfReciprocity;