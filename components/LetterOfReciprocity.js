import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

const GET_RECIPROCAL_REQUEST = gql`
  query getReciprocalRequest($reqId: uuid) {
    yachtClubByHomeycid {
      name
      commodore {
        name
        yc_member {
          email
        }
      }
    }
    yacht_club {
      name
      commodore {
        name
        yc_member {
          email
        }
      }
    }
  }
`;

const LetterOfReciprocity = ({memberRequest}) => {
  const logo = useSelector(state => state.auth.logo);
  const {data, loading, error} = useQuery(GET_RECIPROCAL_REQUEST);
  console.log('memberRequest :', memberRequest)
  return (
    <>
      {logo && <img src={logo} />}
      <Typography>
        March 19, 2023
        
        To Oyster Point Yacht Club board & membership.
        I am writing to let you know that Ryan Opfer is a member in good standing at the Benicia Yacht
        Club. I can vouch for him personally. Any questions, please feel free to phone or text me.
        Best regards,
        Dena Stults
        Commodore
        Benicia Yacht Club
        707 208-4498
      </Typography>
    </>
  )
};

export default LetterOfReciprocity;