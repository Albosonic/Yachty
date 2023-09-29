import { gql, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Box, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import NavBar from "./NavBar";

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

const PaperLetter = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '100%',
  maxWidth: 500,
  maxHeight: 800,
  padding: 20,

}));



const LetterOfReciprocity = ({ reqId }) => {
  const logo = useSelector(state => state.auth.logo);
  const {data, loading, error} = useQuery(GET_RECIPROCAL_REQUEST, {
    variables: {
      reqId
    }
  });

  
  if (loading) return <CircularProgress />
  const { 
    visitingDate, 
    yc_member: { name: memberName },
    yacht_club: { name: visitingYachtClub },
    yachtClubByHomeycid: {name: yachtClubName, commodore: { name: commodoereName } }  
  } = data.reciprocal_request[0];

  let letterDate = new Date().toDateString();
  
  console.log('logo ===', data.reciprocal_request[0])

  return (
    <>
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
              <Typography sx={{marginTop: 2}}>
                707 208-4498
              </Typography>
            </Grid>
          </Grid>
        
      </PaperLetter>
    </>
  )
};

export default LetterOfReciprocity;