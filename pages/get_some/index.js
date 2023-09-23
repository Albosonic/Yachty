
import { Button, Grid, Typography } from "@mui/material";
import { COMODORES, INSERT_COMMODORE, INSERT_MEMBER, INSERT_VESSEL, MAKE_YC, mockClubs, mockMembers, mockVesselData } from "./getSomeGql";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import uuid4 from "uuid4";
import MakeMembers from "@/components/mocks/MakeMembers";
import MakeMemberAplicants from "@/components/mocks/MakeMemberApplicants";
import MakeComodores from "@/components/mocks/MakeComodores";

const buildEverything = () => {
  const [makeYc, {error: ycError, data: ycData, loading: ycLoading}] = useMutation(MAKE_YC);
  const [makeNewMember, {error: memberError, data: memberData, loading: memberLoading}] = useMutation(INSERT_MEMBER);
  const [makeCommodore, {error: comError, data: comData, loading: comLoading}] = useMutation(INSERT_COMMODORE);
  const [makeVessel, {error: vesselError, data: vesselData, loading: vesselLoading}] = useMutation(INSERT_VESSEL);
  // const [insertReciprocalRequestNewVessel, {data: reciprocalData, loading: reciprocalLoadingNewVessel, error: reciprocalErrorNewVessel}] = useMutation(INSERT_RECIPROCAL_REQUEST_NEW_VESSEL);
  // const [insertReciprocalRequestOwnVessel, {data: reciprocalDataOwnVessel, loading: reciprocalLoadingOwnVessel, error: reciprocalErrorOwnVessel}] = useMutation(INSERT_RECIPROCAL_REQUEST);

  const dataFactory = async () => {

    mockClubs.forEach( async club => {
      const { clubName, region, members, applicants } = club;
      const ycResp  = await makeYc({
        variables: {
          name: clubName,
          region,
         }
      });
      console.log('ycResp :', ycResp);
      const ycId = ycResp.data.insert_yacht_clubs.returning[0].id
      
      members.forEach(async (member, index) => {
        const {email, firstName, lastName, name, secondEmail, secondFirstName, secondLastName, secondName, isCommodore} = member;
        console.log('email :', email)
        const memResp = await makeNewMember({
          variables: {
            email,
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

        console.log('memResp', memResp)
        
          applicants.forEach(async (applicant) => {
            const {email, firstName, lastName, secondEmail, secondFirstName, secondLastName } = applicant;
            const applicant = await makeApplicants({
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
        

        const { id: memId } = memResp.data.insert_yc_members.returning[0];

        if (isCommodore) {
          const comRes = await makeCommodore({
            variables: {
              name, 
              yacht_club: ycId, 
              member_id: memId
            }
          });
          console.log('comRes :', comRes)
        }

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
      })
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
        <Button onClick={() => dataFactory()} variant="outlined" >
          Generate Yacht Clubs
        </Button>
      </Grid>
    </Grid>
  )
}

export default buildEverything;
