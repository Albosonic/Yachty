
import { Button, Grid, Typography } from "@mui/material";
import { COMODORES, INSERT_COMMODORE, INSERT_MEMBER, INSERT_VESSEL, MAKE_YC, mockMembers, mockVesselData } from "./getSomeGql";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import uuid4 from "uuid4";
import MakeMembers from "@/components/mocks/MakeMembers";
import MakeMemberAplicants from "@/components/mocks/MakeMemberApplicants";
import MakeComodores from "@/components/mocks/MakeComodores";

const buildEverything = () => {
  let index = 0;
  let clubName = '';
  const REGIONS = [
    {region: 'ef8edbe3-aab1-4b19-9f50-a369c8e0a8cf'},
    {region: 'f58dc1cc-2ddb-4e59-8599-e4136f5b1d6e'},
  ];
  const [ycIds, setYcIds] = useState([]);
  const [makeYc, {error: ycError, data: ycData, loading: ycLoading}] = useMutation(MAKE_YC);
  const [makeNewMember, {error: memberError, data: memberData, loading: memberLoading}] = useMutation(INSERT_MEMBER);
  const [makeCommodore, {error: comError, data: comData, loading: comLoading}] = useMutation(INSERT_COMMODORE);
  const [makeVessel, {error: vesselError, data: vesselData, loading: vesselLoading}] = useMutation(INSERT_VESSEL);
  // const [insertReciprocalRequestNewVessel, {data: reciprocalData, loading: reciprocalLoadingNewVessel, error: reciprocalErrorNewVessel}] = useMutation(INSERT_RECIPROCAL_REQUEST_NEW_VESSEL);
  // const [insertReciprocalRequestOwnVessel, {data: reciprocalDataOwnVessel, loading: reciprocalLoadingOwnVessel, error: reciprocalErrorOwnVessel}] = useMutation(INSERT_RECIPROCAL_REQUEST);

  const dataFactory = async (num) => {
    const ycResults = [];
    const FAKE_CLUB = 'FAKE_CLUB';
    // Make Yacht Clubs
    while(num >= 0) {
      const commodoreInfo = COMODORES[num];
      clubName = num <= 2 ? clubName = commodoreInfo.firstName + commodoreInfo.email : FAKE_CLUB + uuid4();
      index = num % 2 === 0 ? index = 0 : index = 1;
      console.log('clubName :', clubName)
      const resp  = await makeYc({
        variables: {
          name: clubName,
          region: REGIONS[index].region,
         }
      });
      ycResults.push(resp.data.insert_yacht_clubs.returning);
      num--;
    }
    // Make Yacht Club Members
    let roundone = true;
    ycResults.forEach((ycRes, index) => {
      console.log('ycRes :', ycRes[0])
      const {name: ycName, id: ycId} = ycRes[0];

      mockMembers.forEach(async (member, memberIndex) => {
        const {email, firstName, lastName, name, secondEmail, secondFirstName, secondLastName, secondName} = member;
        const fakeEmail = email.split('');
        fakeEmail.splice(0, 1, uuid4())
        console.log('fake email :', fakeEmail)
        const memberEmail = roundone ? email : fakeEmail.join('');
        
        
        const memResp = await makeNewMember({
          variables: {
            email: memberEmail, 
            firstName: firstName,
            lastName: lastName,
            name, 
            secondEmail, 
            secondFirstName, 
            secondLastName, 
            secondName,
            yacht_club: ycId,
          }
        });
        console.log('memResp :', memResp)
        const { id: memId } = memResp.data.insert_yc_members.returning[0];
        // Make vessels
        const { beam, draft, hullMaterial, img, insuranceInfo, length, specialNotes, type, vesselName, getRandomIndex } = mockVesselData;
        const vesselResp = await makeVessel({
          variables: {
            beam,
            draft,
            hullMaterial: hullMaterial[getRandomIndex()],
            img,
            insuranceInfo,
            length,
            specialNotes,
            type: type[getRandomIndex()],
            vesselName: vesselName[getRandomIndex()],
            ownerId: index % 2 === 0 ? null : memId,
            unafilliatedVesselId: index % 2 === 0 ? uuid4() : null,
          }
        });
        console.log('vesselResp :', vesselResp);
        // Make Yacht Club Commodores
        if (ycName.includes(email)) {
          console.log('ycName', ycName)
          console.log('email', email)
          // TODO: display commodores on browser
          const comRes = await makeCommodore({
            variables: {
              name, 
              yacht_club: ycId, 
              member_id: memId
            }
          });
        }
      })
      roundone = false;
    });
  }

  return (
    <Grid 
      sx={{
        margin: '50',
        border: '2px solid red'
      }}
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs>
        <Button onClick={() => dataFactory(4)} variant="outlined" >
          Generate Yacht Clubs
        </Button>
      </Grid>
    </Grid>
  )
}

export default buildEverything;
