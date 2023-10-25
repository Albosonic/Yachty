
import { useState } from "react";
import { Button, Grid } from "@mui/material";
import { useMutation } from "@apollo/client";
import uuid4 from "uuid4";
import { Club_Blue, Club_Madueno, INSERT_COMMODORE, INSERT_MEMBER, INSERT_MEMBER_APPLICANT, INSERT_VESSEL, MAKE_YC, mockClubs, mockMembers, mockVesselData } from "@/lib/gqlQueries/getSomeGql";
import { INSERT_RECIPROCAL_REQUEST } from "@/lib/gqlQueries/requestReciprocitygql";

const buildEverything = () => {
  const [makeYc, {error: ycError, data: ycData, loading: ycLoading}] = useMutation(MAKE_YC);
  const [makeNewMember, {error: memberError, data: memberData, loading: memberLoading}] = useMutation(INSERT_MEMBER);
  const [makeCommodore, {error: comError, data: comData, loading: comLoading}] = useMutation(INSERT_COMMODORE);
  const [makeVessel, {error: vesselError, data: vesselData, loading: vesselLoading}] = useMutation(INSERT_VESSEL);
  const [makeApplicants, {error: memAppError, loading: memAppLoading, data: memAppData}] = useMutation(INSERT_MEMBER_APPLICANT);
  const [insertReciprocalRequestOwnVessel, {data: reciprocalDataOwnVessel, loading: reciprocalLoadingOwnVessel, error: reciprocalErrorOwnVessel}] = useMutation(INSERT_RECIPROCAL_REQUEST);
  const [memberIdsByClub, setMemberIdsByClub] = useState(null);
  const dataFactory = async () => {
    let memIdsByClub = {
      Madueno: [],
      Blue: [],
      Haatveit: [],
      ycIds: {
        Madueno: null,
        Blue: null,
      }
    };

    mockClubs.forEach(async club => {

      const { clubName, region, members, applicants } = club;
      const ycResp  = await makeYc({
        variables: {
          name: clubName,
          region,
         }
      });
      console.log('ycResp :', ycResp);

      const ycId = ycResp.data.insert_yacht_clubs.returning[0].id;

      memIdsByClub.ycIds[clubName] = ycId;

      members.forEach(async member => {
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
        let memberId = memResp.data.insert_yc_members.returning[0].id;

        memIdsByClub[clubName].push(memberId);

        if (isCommodore) {
          const comRes = await makeCommodore({
            variables: {
              name,
              yacht_club: ycId,
              member_id: memberId
            }
          });
          console.log('comRes :', comRes)
        }

      });

      applicants.forEach(async (applicant) => {
        const {email, firstName, lastName, secondEmail, secondFirstName, secondLastName } = applicant;
        const applicantResp = await makeApplicants({
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
    console.log('mems ==', memIdsByClub)
    setMemberIdsByClub(memIdsByClub);
  }

  const handleReciprocalRequests = () => {
    const { beam, draft, hullMaterial, img, insuranceInfo, length, specialNotes, type, vesselName, getRandomIndex } = mockVesselData;
    const { ycIds } = memberIdsByClub;
    console.log('memberIdsByClub =====', memberIdsByClub)
    for(let key in memberIdsByClub) {
      if (key !== 'ycIds') {
        let memberIds = memberIdsByClub[key];
        memberIds.forEach(async (memId, index) => {
          console.log('memId :', memId)

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
              ownerId: memId,
              unafilliatedVesselId: null,
            }
          });

          const { id: savedVesselId } = vesselResp.data.insert_vessels.returning[0];

          console.log('vessel response :', vesselResp)

          if (key === Club_Blue || key === Club_Madueno) {
            const visitingYCId = key === Club_Blue? ycIds[Club_Madueno] : ycIds[Club_Blue];
            const REQUESTING_SLIP = true;
            console.log('yvids :', ycIds)

            let date = new Date().toDateString();

            await insertReciprocalRequestOwnVessel({
              variables: {
                homeYCId: ycIds[key],
                memberId: memId,
                requestingSlip: REQUESTING_SLIP,
                visitingDate: date,
                visitingYCId: visitingYCId,
                vesselId: savedVesselId,
                specialNotes,
              }
            });
          }
        });
      }
    }
  }

  return (
    <Grid
      sx={{
        margin: '50'
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
        {memberIdsByClub && <Button onClick={handleReciprocalRequests} variant="outlined" >
          Generate Reciprocals
        </Button>}
      </Grid>
    </Grid>
  )
}

export default buildEverything;
