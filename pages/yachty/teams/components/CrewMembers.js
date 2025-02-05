import { gql, useQuery } from "@apollo/client"
import { Avatar, AvatarGroup, CircularProgress, Typography } from "@mui/material"
import { useContext } from "react"
import { CurrentVesselContext } from ".."

const GET_CREW_MEMBERS = gql`
  query getCrewMembers($vesselId: uuid) {    
  team_memberships(where: {vesselId: {_eq: $vesselId}, approved: {_eq: true}}) {
    yc_member {
      profilePic
    }
  }  
}`

const CrewMembers = ({ vesselId }) => {
  const vessel = useContext(CurrentVesselContext)
  const {error, loading, data} = useQuery(GET_CREW_MEMBERS, {
    variables: { vesselId }
  })
  if (loading) return <CircularProgress />
  const crew = data?.team_memberships
  console.log('=================>', data.team_memberships)
  return (
    <div className="flex flex-col" >
      <Typography  variant="h6" fontWeight="bold">crew</Typography>
      <AvatarGroup className="self-start" max={5}>
        {crew.map(mate => {
          return (
            <Avatar key={mate.pr} width={70} height={70} src={mate.yc_member.profilePic} />
          )
        })}
      </AvatarGroup>
    </div>
  )
}

export default CrewMembers