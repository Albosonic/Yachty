import { useState } from "react";
import { useSelector } from "react-redux";
import { GET_ALL_USER_ROOMS_BY_ID } from "@/lib/gqlQueries/dmgql";
import { GET_ALL_YC_MEMBERS, INSERT_ROOM, INSERT_USER_ROOMS } from "@/lib/gqlQueries/allMembersgql";
import { gql, useMutation, useQuery } from "@apollo/client";
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
  console.log('total attendees ==========', totalAttendees)
  const userIsCommodore = useSelector(state => state.auth.user.userIsCommodore);
  const memberId = useSelector(state => state.auth.member.id);
  const router = useRouter();
  const ycId = router.query.ycId;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState({...cleanDialog});

  const { data: userRmData, loading: userRmLoading, error: userRmError } = useQuery(GET_ALL_USER_ROOMS_BY_ID, {variables: {memberId}});
  const [createDMRoom, { loading: dMRoomLoading }] = useMutation(INSERT_ROOM);
  const [addUserRooms, { loading: userRoomsLoading }] = useMutation(INSERT_USER_ROOMS);

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
    userRmData.user_rooms.forEach(room => { if (room.recipientId === recipientId) {
      roomId = room.roomId
    } });

    if (roomId === null) {
      const resp = await createDMRoom({variables: {name: `${recipientId}&${memberId}`, type: ROOM_TYPES.PRIVATE, group: `DM&${recipientId}&${memberId}`}});
      roomId = resp.data.insert_room.returning[0].id;
      await addUserRooms({
        variables: {
          objects: [
            {
              memberId: memberId,
              roomId: roomId,
              participantId:`${memberId}${roomId}`,
              recipientId: recipientId
            },
            {
              memberId: recipientId,
              roomId: roomId,
              participantId: `${recipientId}${roomId}`,
              recipientId: memberId,
            }
          ]}
      });
    }
    router.push({
      pathname: '/yachty/direct_messages',
      query: {rid: roomId},
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
              src={img}
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
            {targetMemberId !== memberId && <DialogActions>
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