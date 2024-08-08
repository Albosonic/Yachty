import { Button } from "@mui/material"
import { useSession, signIn, signOut } from "next-auth/react"
const AuthButton = () => {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <Button
          onClick={() => signOut()}
          variant='standard'
          color="secondary"
          sx={{
            color: '#FFFFFF',
            fontFamily: 'Bradley Hand',
            fontSize: 40,
          }}
        >
          sign out
        </Button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <Button
        onClick={() => signIn()}
        variant='standard'
        color="secondary"
        sx={{
          color: '#FFFFFF',
          fontFamily: 'Bradley Hand',
          fontSize: 40,
        }}
      >
        sign in
      </Button>      
    </>
  )
}

export default AuthButton;