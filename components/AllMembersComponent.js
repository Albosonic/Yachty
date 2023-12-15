import { useState } from "react";
import { useSelector } from "react-redux";
import { GET_USERS_ROOM } from "@/lib/gqlQueries/dmgql";
import { INSERT_ROOM } from "@/lib/gqlQueries/allMembersgql";
import { useMutation } from "@apollo/client";
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { ROOM_TYPES } from "@/slices/actions/authActions";
import client from "@/lib/clients/apollo-client";

const cleanDialog = {
  open: false,
  active: false,
  duesOwed: 0,
  email: '',
  name: '',
  bio: '',
  profilePic: '',
  vessels: [],
  id: '',
}

const AllMembersTable = ({ columns, data, totalAttendees }) => {  
  const memberId = useSelector(state => state.auth.member.id);
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState({...cleanDialog});
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);

  const [createDMRoom, { loading: dMRoomLoading }] = useMutation(INSERT_ROOM);  

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleClose = async () => {
    setOpenDialog({...cleanDialog})
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const directMessage = async (recipientId) => {
    let roomId = null;
    const queryResp = await client.query({
      query: GET_USERS_ROOM,
      fetchPolicy: 'no-cache',
      variables: {
        recipientId,
        memberId,
      }
    })
    const userRmData = queryResp?.data?.user_rooms;
    if (userRmData.length === 0) {
      const resp = await createDMRoom({
        variables: {
          memberId,
          recipientId,
          ycId,
        }
      });
      roomId = resp.data.insert_user_rooms_one.id;
    } else {
      roomId = queryResp?.data?.user_rooms[0].id;
    }
    
    router.push({
      pathname: '/yachty/direct_messages',
      query: { rid: roomId },
    })
  }

  let rows = [...data.yc_members].sort((a, b) => a.name.localeCompare(b.name));

  const {
    open,
    name: memberName,
    email: memberEmail,
    bio: memberBio,
    profilePic: memberPic,
    vessels,
    id: targetMemberId,
  } = openDialog;

  const memberVessel = vessels[0];

  const hullMaterial = memberVessel?.hullMaterial;
  const length = memberVessel?.length;
  const img = memberVessel?.img;
  const make = memberVessel?.make;
  const model = memberVessel?.model;
  const beam = memberVessel?.beam;
  const draft = memberVessel?.draft;
  const marina = memberVessel?.marina;
  const sailNumber = memberVessel?.sailNumber;
  const specialNotes = memberVessel?.specialNotes;
  const type = memberVessel?.type;
  const slip = memberVessel?.slip;
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>




      {/* TODO: get this dialog into it's own container */}
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={open}
        onClose={() => setOpenDialog({...cleanDialog})}
      >
        <DialogContent>
          <Grid container justifyContent="space-between">
            <DialogTitle>{ memberName }</DialogTitle>
            <Avatar alt="Profile Pic" src={memberPic} />
          </Grid>
          <Grid container justifyContent="space-around">
            <Box
              component="img"
              sx={{
                height: 200,
                width: 200,
                marginBottom: 2,
                borderRadius: 3
              }}
              alt="The house from the offer."
              src={img || "https://yachty-letter-heads.s3.us-west-1.amazonaws.com/db10f677-4c20-49dc-95eb-88d3ff3aae8c"}
            />
            <Stack spacing={.5}>
              {make && <DialogContentText>{`make: ${make}`}</DialogContentText>}
              {memberEmail && <DialogContentText>{`email: ${memberEmail}`}</DialogContentText>}
              {make && <DialogContentText>{`make: ${make}`}</DialogContentText>}
              {model && <DialogContentText>{`model: ${model}`}</DialogContentText>}
              {length && <DialogContentText>{`length: ${length}`}</DialogContentText>}
              {beam && <DialogContentText>{`beam: ${beam}`}</DialogContentText>}
              {draft && <DialogContentText>{`draft: ${draft}`}</DialogContentText>}
              {sailNumber && <DialogContentText>{`sail number: ${sailNumber}`}</DialogContentText>}
              {marina && <DialogContentText>{`marina: ${marina}`}</DialogContentText>}
              {slip && <DialogContentText>{`slip: ${slip}`}</DialogContentText>}
              {hullMaterial && <DialogContentText>{`hullMaterial: ${hullMaterial}`}</DialogContentText>}
              {length && <DialogContentText>{`length: ${length}`}</DialogContentText>}
            </Stack>
          </Grid>
          <DialogContentText>{memberBio}</DialogContentText>
          <Grid container justifyContent="space-between" >
            <DialogActions>
              <Button onClick={handleClose}>go back</Button>
            </DialogActions>
            {targetMemberId !== memberId && 
            <DialogActions>
              <Button onClick={() => directMessage(targetMemberId)}>Send Message</Button>
            </DialogActions>}
            {/* <DialogActions>
              <Button color="success" onClick={() => handlePayment(memberEmail)}>Dues Paid</Button>
            </DialogActions> */}
          </Grid>
        </DialogContent>
      </Dialog>




      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, i) => {
                return (
                  <TableCell
                    key={column.id + i}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => {
                return (
                  <TableRow onClick={() => setOpenDialog({ ...cleanDialog, ...row, open: true })} hover role="checkbox" tabIndex={-1} key={row.email}>
                    {columns.map((column, i) => {
                      let value = row[column.id];
                      if (Array.isArray(value)) {
                        value = value.length > 0 ? value[0][column.nestedKey] : null;
                      }
                      if (column.id === 'profilePic') {
                        return (
                          <TableCell key={column.id + i + column.label} align={column.align}>
                            <Avatar src={value} />
                          </TableCell>
                        )
                      }
                      return (
                        <TableCell key={column + i} align={column.align}>
                          {column.format && typeof value === 'number'? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {totalAttendees === 0 && 
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />}
      {totalAttendees > 0 && 
        <Grid container justifyContent="flex-end">
          <Typography sx={{padding: 2}}>Total Attendees {totalAttendees}</Typography>
        </Grid>
      }
    </Paper>
  );
}

export default AllMembersTable;