import { gql, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { CircularProgress, Paper, Typography } from "@mui/material";
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
  height: '150%',
  maxWidth: 500,
  // maxHeight: 5000,
  padding: 100,
  // ...theme.typography.body2,
  // textAlign: 'center',
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
    yachtClubByHomeycid: { commodore: { name: commodoereName } }  
  } = data.reciprocal_request[0]
  
  console.log('logo ===', logo)

  return (
    <>
      <PaperLetter square elevation={10}>
        {logo && <img src={logo} />}
        <img src={logo} />
        <Typography>
          March 19, 2023
        </Typography>
        <Typography>
          To { visitingYachtClub } Yacht Club board & membership.
          I am writing to let you know that { memberName } is a member in good standing at the Benicia Yacht
          Club. I can vouch for him personally. Any questions, please feel free to phone or text me.
          Best regards,
          <Typography>
            { commodoereName }
          </Typography>
          <Typography>
            Commodore
            Benicia Yacht Club
          </Typography>
            707 208-4498
        </Typography>
      </PaperLetter>
    </>
  )
};

export default LetterOfReciprocity;