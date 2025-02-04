import NavBar from "@/components/NavBar"
import { Avatar, AvatarGroup, Stack, Typography, useMediaQuery } from "@mui/material"
import Team from "./components/team";
import TeamVessel from "./components/TeamVessel";

const Teams = () => {
  const moreThan600px = useMediaQuery('(min-width:600px)')
  const mainContent = moreThan600px ? "start" : "center"
  return (
    <>    
    <NavBar />
      <Stack flexDirection="row" justifyContent={mainContent}>
        <Team />
        {moreThan600px && <TeamVessel />}
      </Stack>
    </>

  )
}

export default Teams