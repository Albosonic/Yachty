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
import LoadingYachty from "./LoadingYachty";

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 100 },
  { id: 'duesOwed', label: 'Dues Owed', minWidth: 170 },
  { id: 'vessels', label: 'Vessel Name', nestedKey: 'vesselName', minWidth: 170 },
  { id: 'vessels', label: 'Vessel Type', nestedKey: 'type', minWidth: 170 },
];

const cleanDialog = {
  open: false,
  active: false,
  duesOwed: 0,
  email: '',
  name: '',
}

const UPDATE_MEMBER_DUES = gql`
  mutation updateMemberDues($newBalance: Int, $email: String) {
  update_yc_members(where: {email: {_eq: $email}}, _set: {duesOwed: $newBalance}) {
    affected_rows
  }
}`;

const AllMembersTable = ({props}) => {
  const userIsCommodore = useSelector(state => state.auth.user.userIsCommodore);
  const memberId = useSelector(state => state.auth.member.id);
  const router = useRouter();
  const ycId = router.query.ycId;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState({...cleanDialog});

  const { error, loading,  data, refetch } = useQuery(GET_ALL_YC_MEMBERS, { variables: { ycId, fetchPolicy: 'no-cache' } });

  const { data: userRmData, loading: userRmLoading, error: userRmError } = useQuery(GET_ALL_USER_ROOMS_BY_ID, {variables: {memberId}});
  const [payDues, { loading: paymentLoading }] = useMutation(UPDATE_MEMBER_DUES);
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
  const handlePayment = async (memberEmail) => {
    await payDues({ variables: { newBalance: 0, email: memberEmail }});
    await refetch({ycId: ycId});
    handleClose();
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

  // TODO: make this part of the db.
  const BENICIA_MEMBER_DUES = 315;
  
  if (loading || !data) return <LoadingYachty isRoot={false} />
  
  let rows = [...data.yc_members].sort((a, b) => a.name.localeCompare(b.name));
  console.log('data member data ===============', data)
  const { 
    open, 
    name: memberName, 
    duesOwed: memberDuesOwed, 
    active: memberActive, 
    email: memberEmail, 
    bio: memberBio, 
    profilePic: memberPic, 
    vessels, 
    id: targetMemberId,
  } = openDialog;
  console.log('open d ==========:', openDialog)
  const memberDuesText = memberDuesOwed > BENICIA_MEMBER_DUES ? `Back dues owed: ${memberDuesOwed}` : `Membership in good standing no back dues owed`;
  const activeMemberText = memberActive ? 'Active' : 'Inactive';
  const memberVessel = vessels && vessels.length > 0 ? vessels[0] : null;

  // const {} = memberVessel;
  // console.log('memberVessel ===============', memberVessel)
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* TODO: abstract dialog into its own component */}
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={open}
        onClose={() => setOpenDialog({...cleanDialog})}
      >
        <DialogContent>
          <Grid container justifyContent="space-between">
            <DialogTitle>{ `${activeMemberText} Member ${memberName}` }</DialogTitle>
            <Avatar alt="Profile Pic" src={memberPic} />
          </Grid>
          {userIsCommodore && 
          <DialogContentText>
            {memberDuesText}
          </DialogContentText>
          }
          <DialogContentText>
            {memberEmail}
          </DialogContentText>
          <DialogContentText>
            Member Bio: {memberBio}
          </DialogContentText>
          <Grid container>
            <Stack alignItems="center">
              <Typography>
                Vessel: {memberVessel?.vesselName}
              </Typography>
              <Box
                component="img"
                sx={{
                  height: 200,
                  width: 200,
                  marginBottom: 2,
                  borderRadius: 3
                }}
                alt="The house from the offer."
                src={memberVessel?.img} 
              />
            </Stack>
            <Stack sx={{marginTop: 5, marginLeft: 2}}>
              <Typography>
                hullMaterial: {memberVessel?.hullMaterial}
              </Typography>
              <Typography>
                length: {memberVessel?.length}
              </Typography>
            </Stack>
          </Grid>
          <Grid container justifyContent="space-between" >
            <DialogActions>
              <Button onClick={handleClose}>go back</Button>
            </DialogActions>
            {targetMemberId !== memberId && <DialogActions>
              <Button onClick={() => directMessage(targetMemberId)}>Send Message</Button>
            </DialogActions>}
            <DialogActions>
              <Button color="success" onClick={() => handlePayment(memberEmail)}>Dues Paid</Button>
            </DialogActions>
          </Grid>
        </DialogContent>
      </Dialog>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column, i) => (
                <TableCell
                  key={column.id + i}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => {
                return (
                  <TableRow onClick={() => setOpenDialog({...row, open: true })} hover role="checkbox" tabIndex={-1} key={row.email}>
                    {columns.map((column, i) => {
                      let value = row[column.id];
                      if (Array.isArray(value)) {
                        value = value.length > 0 ? value[0][column.nestedKey] : null;
                      }
                      return (
                        <TableCell key={column + i} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default AllMembersTable;