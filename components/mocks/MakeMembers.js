import { gql, useMutation } from "@apollo/client";
import { Button } from "@mui/material";
import uuid4 from "uuid4";
import MakeReciprocals from "./MakeReciprocals";
import { useState } from "react";
import MakeComodores from "./MakeComodores";

const INSERT_MEMBER = gql`
  mutation inserMembers(
    $email: String,
    $firstName: String,
    $lastName: String,
    $name: String,
    $secondEmail: String,
    $secondFirstName: String,
    $secondLastName: String,
    $secondName: String,
    $yacht_club: uuid,
  ) {
  insert_yc_members(objects: {email: $email, firstName: $firstName, lastName: $lastName, name: $name, secondEmail: $secondEmail, secondFirstName: $secondFirstName, secondLastName: $secondLastName, secondName: $secondName, yacht_club: $yacht_club}) {
    returning {
      id
      email
      firstName
      lastName
      name
      yacht_club
      secondEmail
      secondFirstName
      secondLastName
      secondName
    }
  }
}
`;

const newMembers = [
  {email: 'jackblack@gmail.com', firstName: "Jack", lastName: "Black", name: "Jack Black", secondEmail: 'jackwhite@gmail.com', secondFirstName: "Jacko", secondLastName: "White", secondName: "Jacko White"},
  {email: 'bob@gmail.com', firstName: "Bob", lastName: "Barker", name: "Bob Barker", secondEmail: 'vanna@gmail.com', secondFirstName: "Vanna", secondLastName: "Blue", secondName: "Vanna Blue"},
  {email: 'dude@gmail.com', firstName: "Dude", lastName: "ster", name: "Dude ster", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
  {email: 'jay@gmail.com', firstName: "Jay", lastName: "Mann", name: "Jay Man", secondEmail: "dee@gmail.com", secondFirstName: "Dee", secondLastName: "Dah", secondName: "Dee Dah"},
];

const MakeMembers = ({ycIds}) => {
  const [makeNewMember, {error, data, loading}] = useMutation(INSERT_MEMBER);
  const [members, setMembers] = useState([]);
  const dataFactory = () => {
    let results = [];
    ycIds.forEach(ycId => {
      newMembers.forEach(async (member, memberIndex) => {
        const {email, firstName, lastName, name, secondEmail, secondFirstName, secondLastName, secondName} = member;
        console.log('memberIndex :', memberIndex)
        console.log('memberIndex === 0 :', memberIndex === 0)
        const memberEmail = memberIndex === 0 ? email : `${email}${uuid4()}`;
        const resp = await makeNewMember({
          variables: {
            email: memberEmail, 
            firstName, 
            lastName, 
            name, 
            secondEmail, 
            secondFirstName, 
            secondLastName, 
            secondName,
            yacht_club: ycId,
          }
        });
        results.push(resp.data.insert_yc_members.returning[0])
      })
    });
    console.log('results :', results)
    setMembers(results);

    // commodores.forEach(async (commodore, index) => {
    //   const {email, firstName, lastName, name, secondEmail, secondFirstName, secondLastName, secondName} = commodore;
    //   const resp = await makeNewMember({
    //     variables: {
    //       email, 
    //       firstName, 
    //       lastName, 
    //       name, 
    //       secondEmail, 
    //       secondFirstName, 
    //       secondLastName, 
    //       secondName,
    //       yacht_club: ycIds[index],
    //     }
    //   });
    // })
  };
  const showMakeReciprocals = (members.length > 0);
  return (
    <>
      <Button onClick={dataFactory} variant="outlined">
        Generate YC Members
      </Button>
      {showMakeReciprocals && <MakeReciprocals ycIds={ycIds} members={members} />}
      {/* {showMakeReciprocals && <MakeComodores ycIds={ycIds}/>} */}
    </>
  )
};

export default MakeMembers;