import { GET_ALL_YC_MEMBERS } from "@/pages/yachty/view_all_members/allMembersgql";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Avatar, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from "@mui/material";
import { useRouter } from "next/router";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 100 },
  { id: 'duesOwed', label: 'Dues Owed', minWidth: 170 },
  { id: 'vessels', label: 'Vessel Name', nestedKey: 'vesselName', minWidth: 170 },
  { id: 'vessels', label: 'Vessel Type', nestedKey: 'type', minWidth: 170 },
  // { id: 'density', label: 'Density', minWidth: 170, align: 'right', format: (value) => value.toFixed(2) },
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
}
`

const AllMembersTable = ({props}) => {
  const {user} = useUser();
  const router = useRouter();
  const ycId = router.query.ycId;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { error, loading,  data, refetch } = useQuery(GET_ALL_YC_MEMBERS, { variables: { ycId, fetchPolicy: 'no-cache' } });
  const [payDues, { loading: paymentLoading }] = useMutation(UPDATE_MEMBER_DUES)
  const [openDialog, setOpenDialog] = useState({...cleanDialog});
  // const [rows, setRows] = useState([])

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
  }

  // TODO: make this part of the db.
  const BENICIA_MEMBER_DUES = 315;
  if (loading || !data) return <CircularProgress />
  console.log('data', data)
  let rows = [...data.yc_members].sort((a, b) => a.name.localeCompare(b.name));
  
  const { open, name: memberName, duesOwed: memberDuesOwed, active: memberActive, email: memberEmail } = openDialog;
  const memberDuesText = memberDuesOwed > BENICIA_MEMBER_DUES ? `Back dues owed: ${memberDuesOwed}` : `Membership in good standing no back dues owed`;
  const activeMemberText = memberActive ? 'Active' : 'Inactive';
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={open}
        onClose={() => setOpenDialog({...cleanDialog})}
      >
        <DialogContent>
          <Grid container justifyContent="space-between" >
            <DialogTitle>{ `${activeMemberText} Member ${memberName}` }</DialogTitle>
            <Avatar alt="Remy Sharp" src={user?.picture} />
          </Grid>
          <DialogContentText>
            {memberDuesText}
          </DialogContentText>
          <DialogContentText>
            {memberEmail}
          </DialogContentText>
          <DialogContentText>
            Bio: 
          </DialogContentText>
          <Grid container justifyContent="space-between" >
            <DialogActions>
              <Button onClick={handleClose}>go back</Button>
            </DialogActions>
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