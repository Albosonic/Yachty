import { gql, useMutation } from "@apollo/client";
import { Button } from "@mui/material";
import uuid4 from "uuid4";

const INSERT_MEMBER_APPLICANT = gql`
  mutation insertPotentialMembers(
    $email: String,
    $firstName: String,
    $lastName: String,
    $secondEmail: String,
    $secondFirstName: String,
    $secondLastName: String,
    $yacht_club: uuid,
    $referredBy: String,
  ) {
  insert_potential_members(objects: {
    email: $email,
    firstName: $firstName,
    lastName: $lastName,
    secondEmail: $secondEmail,
    secondFirstName: $secondFirstName,
    secondLastName: $secondLastName,
    yacht_club: $yacht_club,
    referredBy: $referredBy
  }) {
    affected_rows
  }
}`;

const newMembers = [
  {email: '2jackblack@gmail.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
  {email: '2bob@gmail.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
  {email: '2dude@gmail.com', firstName: "Dude", lastName: "ster", name: "Dude ster", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
  {email: '2jay@gmail.com', firstName: "Jay", lastName: "Mann", name: "Jay Man", secondEmail: "dee@gmail.com", secondFirstName: "Dee", secondLastName: "Dah", secondName: "Dee Dah"},
];

const MakeMemberAplicants = ({ycIds}) => {
  const [makeApplicants, {error, loading, data}] = useMutation(INSERT_MEMBER_APPLICANT);
  const dataFactory = () => {
    ycIds.forEach(async (ycId) => {
      newMembers.forEach(async (member) => {
        const {email, firstName, lastName, secondEmail, secondFirstName, secondLastName } = member;
        const resp = await makeApplicants({
          variables: {
            email: `${email}${uuid4()}`, 
            firstName, 
            lastName, 
            secondEmail, 
            secondFirstName, 
            secondLastName,
            yacht_club: ycId,
          }
        });
      });
    });
  }
  return (
    <>
      <Button variant="outlined" onClick={dataFactory}>
        Generate New Member Applicants
      </Button>
    </>
  )
};

export default MakeMemberAplicants;