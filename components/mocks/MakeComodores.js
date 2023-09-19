import { gql } from "@apollo/client";
import { Button } from "@mui/material";

// const INSERT_COMMODORE = gql`

// `;

const commodores = [
  {email: 'albertomadueno@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
  {email: 'snipeboatblue@gmail.com', firstName: "Alberto", lastName: "Madueno", name: "Alberto Madueno", secondEmail: null, secondFirstName: null, secondLastName: null, secondName: null},
];

const MakeComodores = ({ycIds}) => {
  const dataFactory = () => {
    commodores.forEach(async (commodore, index) => {
      // insert commodores here...
      const ycId = ycIds[index];

    })
  }
  return (
    <Button variant="outlined" onClick={dataFactory}>
      Add Commodores
    </Button>
  )
}

export default MakeComodores