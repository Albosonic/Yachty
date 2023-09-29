import { gql, useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Alert, Box, Button, CircularProgress, Grid, Paper, Snackbar, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import NavBar from "./NavBar";
import { useRouter } from "next/router";
import { useState } from "react";

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


const LetterOfReciprocity = ({ reqId }) => {
  const router = useRouter();
  const logo = useSelector(state => state.auth.member.yachtClubByYachtClub.logo);
  const [snackBarContent, setSnackBarMsg] = useState({msg: 'Member Approved', type: 'success'});
  const [showSuccess, setShowSuccess] = useState(false);
  const [updateReciprocalStatus, {data: mutData, loading: mutLoading, error: muteError }] = useMutation(UPDATE_RECIPROCAL_STATUS);
  const {data, loading, error} = useQuery(GET_RECIPROCAL_REQUEST, {
    variables: {
      reqId
    }
  });
  let letterDate = new Date().toDateString();
  const handleSendLetter = async (id) => {
    console.log('id :', id)
    console.log('string :', letterDate)
    // await updateReciprocalStatus({variables: {id, letterDate}});
    // setShowSuccess(true);
  }
  const handleClose = () => router.back();


  if (loading || !data) return <CircularProgress />
  const { 
    visitingDate, 
    yc_member: { name: memberName },
    yacht_club: { name: visitingYachtClub },
    yachtClubByHomeycid: {name: yachtClubName, commodore: { name: commodoereName } }  
  } = data.reciprocal_request[0];
  
  console.log('logo ===', logo)

  return (
    <>
      <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
        <Alert onClose={handleClose} sx={{ width: '100%' }}>
          {snackBarContent}
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
                  // maxHeight: { xs: 100, md: 100 },
                  // maxWidth: { xs: 100, md: 100 },
                }}
                alt="The house from the offer."
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
                { commodoereName }
              </Typography>
              <Typography sx={{marginTop: 2}}>
                Commodore
                Benicia Yacht Club
              </Typography>
              <Grid container justifyContent="space-between">
                <Typography sx={{marginTop: 2}}>
                  707 208-4498
                </Typography>
                <Button onClick={handleSendLetter}>
                  Send Letter
                </Button>
              </Grid>
            </Grid>
          </Grid>
        
      </PaperLetter>
    </>
  )
};

export default LetterOfReciprocity;