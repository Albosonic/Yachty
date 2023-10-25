import client from "@/lib/clients/apollo-client";
import { gql } from "@apollo/client"

const GET_TEST_DATA = gql`
  query getTestDat {
      yc_members {
      firstName
      lastName
    }
  }
`;

export default async function handler(req, res) {
  console.log('req :', req);
  res.status(200).json({ name: 'John Doe pay your bill dude' })
  const resp = await client.query({
    query: GET_TEST_DATA
  });
  console.log('resp :', resp);
}