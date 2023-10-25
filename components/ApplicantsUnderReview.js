import { ADD_NEW_MEMBER, DENY_MEMBERSHIP } from "@/lib/gqlQueries/addMemberGQL";
import { Alert, Box, Button, Divider, Paper, Snackbar, Stack, Typography, styled } from "@mui/material";
import styles from '@/styles/applicantReview.module.css'
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
          const { firstName, lastName, email, secondFirstName, secondLastName, secondEmail, referredBy } = applicant;
          const name = `${firstName} ${lastName}`;
          const secondName = `${secondFirstName} ${secondLastName}`;
          return (
            <Item key={`${applicant}${index}`}>
              <div>
                <Snackbar open={showSuccess} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} key={'top'+'center'} >
                  <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {msg}
                  </Alert>
                </Snackbar>
              </div>
              <Typography spacing={2} variant="h4">Primary Member</Typography>
              <Typography spacing={2} >
                { `${firstName} ${lastName}` }
              </Typography>
              <Typography spacing={2}>{ email }</Typography>
              <Typography variant="h4">Secondary Member</Typography>
              <Typography spacing={2}>
                { `${secondFirstName} ${secondLastName}` }
              </Typography>
              <Typography spacing={2}>{ secondEmail }</Typography>
              <Typography>member referrence: { referredBy }</Typography>
              <div className={styles.buttonsContainer}>
                <Button 
                  color="success"
                  variant="outlined" 
                  onClick={() => {
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
                        ycId
                      }
                    })}
                  }>
                    Approve
                </Button>
                <Button color="error"
                  variant="outlined"
                  onClick={() => handleDenyMembership({variables:{email}})}>
                    Deny
                </Button>
              </div>
            </Item>
          )
        })}
      </Stack>
    </Box>
  );
}

export default ApplicantsUnderReview;
