import { Avatar, Grid, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const Msg = ({ msg, authorId, profilePic }) => {
  const memberId = useSelector(state => state.auth.member.id);
    const leftOrRight = authorId === memberId ? "flex-start" : "flex-end";
    return (
      <Grid container justifyContent={leftOrRight} sx={{ width: '80%'}} >
        {authorId === memberId ? (
          <>
          <Avatar src={profilePic || userPic}
            sx={{
              width: 20,
              height: 20,
              marginRight: -.3,
            }}
          />          
          <Typography
            sx={{
              border: '1px solid grey',
              borderRadius: 3.5,
              paddingTop: .4,
              paddingBottom: .4,
              paddingLeft: 1.5,
              paddingRight: 1.5,
              opacity: .5,              
            }}
          >
            {msg}
          </Typography>          
        </>
        ) : (
          <>
            <Typography
              sx={{
                border: '1px solid grey',
                borderRadius: 3.5,
                paddingTop: .4,
                paddingBottom: .4,
                paddingLeft: 1.5,
                paddingRight: 1.5,
                opacity: .5,
              }}
            >
              {msg}
            </Typography>
            <Avatar src={profilePic || userPic}
              sx={{
                width: 20,
                height: 20,
                marginRight: -.3,
              }}
            />
          </>
        )}
      </Grid>
    )
  }

  export default Msg;