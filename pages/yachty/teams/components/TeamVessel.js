import { Button, CircularProgress, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { useContext, useEffect, useState } from "react"
import { CurrentVesselContext } from ".."
import { gql, useMutation, useQuery } from "@apollo/client"
import { useSelector } from "react-redux"

const INSERT_TEAM_MEMBER = gql`
  mutation insertTeamMember($objects: [team_memberships_insert_input!]!) {
  insert_team_memberships(objects: $objects) {
    returning {
      memberId
    }
  }
}`

const GET_TEAM_ASKS = gql`
  query getTeamAsks($memberId: uuid) {
  team_memberships(where: {memberId: {_eq: $memberId}}) {
    vesselId
    approved
  }
}
`

const TeamVessel = () => {
  const vessel = useContext(CurrentVesselContext)
  const memberId = useSelector(state => state.auth.member.id)
  const { error, loading: loadingAskData, data: asksData , refetch: refetchAsk } = useQuery(GET_TEAM_ASKS, { 
    variables: { memberId }, 
    fetchPolicy: 'no-cache'
  })
  const [insertTeamAsk, {loading: loadingInsertAsk, data: insertAskData }] = useMutation(INSERT_TEAM_MEMBER)
  const [disabled, setDisabled] = useState()

  if (!vessel) return <CircularProgress />
  
  const { img, id: vesselId, yc_member: { id: ownerId } } = vessel  
  const myBoat = memberId === ownerId
  
  useEffect(() => {
    if (asksData?.team_memberships.length > 0) {      
      const askDataVesselId = asksData.team_memberships[0].vesselId
      askDataVesselId === vesselId ? setDisabled(true) : setDisabled(false)      
    }
    if (myBoat) setDisabled(true)
  }, [asksData, vesselId])

  const requestTeamMembership = async () => {
    setDisabled(true)
    await insertTeamAsk({variables: {objects: { memberId, vesselId }}})
    await refetchAsk()
  }
  const buttonText = disabled ? 'pending approval...' : 'join crew'
  return (
    <Stack
      padding={2}
      flexDirection="row"
      className="justify-start border w-screen max-h-96"   
    >
      <img
        className="rounded mr-10"
        src={img}
      />
      <Stack flexDirection="column">      
        <Typography variant="h5" >
          About:
        </Typography>
        <Typography className="max-w-96 flex-1">
          Lorem ipsum in paris is the way. Go down the road and turn left onto the the side, then get some impsu lorem to do Lorem ipsum in paris is the way. Go down the road and turn left onto the the side, then get some impsu lorem to do
        </Typography>
        {!myBoat && (
          <Button disabled={disabled} onClick={async () => await requestTeamMembership() } variant="outlined" >
            { buttonText }
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

export default TeamVessel