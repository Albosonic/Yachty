import { useQuery } from "@apollo/client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Typography } from "@mui/material";

const ApplicationSent = () => {
  return (
    <>
      <Typography variant="h2">
        Application Sent
      </Typography>
    </>
  )
}

export default ApplicationSent;