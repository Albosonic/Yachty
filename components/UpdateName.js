import { gql, useMutation } from "@apollo/client";
import { Button, Fab, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateMemberNameAct } from "@/slices/actions/authActions";

const UPDATE_MEMBER_NAME = gql`
  mutation updateMemberName($memberId: uuid! , $firstName: String, $lastName: String, $name: String) {
  update_yc_members(where: {id: {_eq: $memberId}}, _set: {firstName: $firstName, lastName: $lastName, name: $name}) {
    affected_rows
  }
}`;

const UpdateName = () => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameSet, setNameSet] = useState(false)

  const memberId = useSelector(state => state.auth.member.id);
  const name = useSelector(state => state.auth.member.name);
  const last = useSelector(state => state.auth.member.lastName);
  const first = useSelector(state => state.auth.member.firstName);

  const [updateMemberName, {memberNameLoading}] = useMutation(UPDATE_MEMBER_NAME);

  useEffect(() => {
    const isNewUser = name.includes('.com');
    if (!isNewUser) {
      setFirstName(first)
      setLastName(last)
      setNameSet(true)
    }
  },[name])

  const updateName = async () => {
    await updateMemberName({
      variables: {
        memberId,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`
      }
    })
    const isNewUser = name.includes('.com');
    const userName = isNewUser ? `${firstName} ${lastName}` : name;
    dispatch(updateMemberNameAct(firstName, lastName, userName));
    setNameSet(true);
  }

  const editName = () => {
    setNameSet(false);
  }

  return (   
    <>
    {!nameSet && 
      <Stack alignItems="center" sx={{ width: "100%"}}>        
        <Grid container justifyContent="space-around" sx={{maxWidth: 500, width: '100%'}}>      
          <TextField
            multiline
            variant="standard"
            label="first name"
            sx={{margin: 1}}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            multiline
            sx={{margin: 1}}
            variant="standard"
            label="last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />          
        </Grid>
        <Button
          onClick={updateName}
          size="small"
          sx={{marginTop: 2}}
          disabled={memberNameLoading}
        >
          Update Name
        </Button>
      </Stack>
    }
    {nameSet &&
      <Grid container justifyContent="center" sx={{maxWidth: 400}} >
        <Typography sx={{margin: 1}} variant="h6">{firstName}</Typography>
        <Typography sx={{margin: 1}} variant="h6">{lastName}</Typography>
          <IconButton onClick={editName}>
            <EditIcon sx={{fontSize: 18}} color="primary" />        
          </IconButton>
      </Grid>
    }
    </> 
  )
}

export default UpdateName;