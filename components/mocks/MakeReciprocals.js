import { gql, useMutation } from "@apollo/client";
import { Button } from "@mui/material";

const INSERT_RECIPROCAL = gql`
  mutation insertReciprocalRequest(
    $visitingYCId: uuid, 
    $visitingDate: date, 
    $vesselId: uuid, 
    $unafilliatedVesselId: uuid,
    $specialNotes: String, 
    $requestingSlip: Boolean, 
    $memberId: uuid, 
    $homeYCId: uuid
  ) {
  insert_reciprocal_request(objects: {
    visitingYCId: $visitingYCId, 
    visitingDate: $visitingDate, 
    vesselId: $vesselId, 
    unafilliatedVesselId: $unafilliatedVesselId,
    specialNotes: $specialNotes, 
    requestingSlip: $requestingSlip, 
    memberId: $memberId, 
    homeYCId: $homeYCId}
  ) {
    affected_rows
  }
}`;

const MakeReciprocals = ({ycIds, members}) => {
  const [makeReciprocal, {error, data, loading}] = useMutation(INSERT_RECIPROCAL);
  const dataFactory = () => {
    ycIds.forEach(ycId => {
      let requestingSlip = false;

      members.forEach( async (member) => {
        requestingSlip = !requestingSlip;
        const { yacht_club, id } = member;
        if (yacht_club === ycId) return;
        await makeReciprocal({
          variables: {
            homeYCId: yacht_club,
            visitingYCId: ycId, 
            visitingDate: new Date, 
            vesselId: null, 
            unafilliatedVesselId: null,
            specialNotes: 'lorem ipsum lorem ipsum', 
            requestingSlip, 
            memberId: id, 
          }
        })
      })
    });
  }
  return (
    <>
      <Button variant="outlined" onClick={dataFactory}>
        Generate Reciprocal Requests
      </Button>   
    </>
  )
};

export default MakeReciprocals;