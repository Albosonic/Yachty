import NavBar from "@/components/NavBar"
import { Avatar, AvatarGroup, Box, Stack, Typography, useMediaQuery } from "@mui/material"
import Team from "./components/team";
import TeamVessel from "./components/TeamVessel";
import { gql, useQuery } from "@apollo/client";
import LoadingYachty from "@/components/LoadingYachty";
import { createContext, useEffect, useState } from "react";

const GET_RACE_VESSELS = gql`
  query getRaceVessels {
    vessels(where: {yc_member: {isRacer: {_eq: true}}}) {
    beam
    draft
    hullMaterial
    id
    img
    length
    make
    model
    sailNumber
    vesselName
    type
    yc_member {
      lastName
      firstName
      profilePic
    }
  }
}`;

export const CurrentVesselContext = createContext(null)
const Teams = () => {
  const moreThan600px = useMediaQuery('(min-width:600px)')
  const { error, loading, data } = useQuery(GET_RACE_VESSELS)  
  const vessels = data?.vessels
  const [vessel, setVessel] = useState({ vessel: null })
  useEffect(() => {if (vessels) setVessel(vessels[0])}, [vessels])
  if (loading || !vessels) return <LoadingYachty />  
  const mainContent = moreThan600px ? "start" : "center"  
  return (
    <>
    <NavBar />
      <CurrentVesselContext.Provider value={vessel}>
        <Stack flexDirection="row" justifyContent={mainContent}>
          <Stack className="overflow-hidden overflow-y-scroll h-screen">
            {vessels.map(vessel => {
              return (
                <Box key={vessel.id} className="cursor-pointer hover:bg-slate-200 border-b-2" onClick={() => setVessel(vessel)}>
                  <Team key={vessel.id} vessel={vessel} />
                </Box>
              )
            })}
          </Stack>        
          {moreThan600px && <TeamVessel value={vessel} />}
        </Stack>
      </CurrentVesselContext.Provider>
    </>

  )
}

export default Teams