import { GET_ALL_YC_MEMBERS } from "@/pages/yachty/view_all_members/allMembersgql";
import { useQuery } from "@apollo/client";
import { Avatar, CircularProgress, Dialog, DialogContentText, DialogTitle, Grid } from "@mui/material";
import { useRouter } from "next/router";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState } from "react";
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

const AllMembersTable = ({props}) => {
  const user = useUser();
  const router = useRouter();
  const ycId = router.query.ycId;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { error, loading,  data } = useQuery(GET_ALL_YC_MEMBERS, { variables: { ycId, fetchPolicy: 'no-cache' } });
  const [openDialog, setOpenDialog] = useState({...cleanDialog});
  
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
    
  if (loading || !data) return <CircularProgress />
  console.log('data', data)
  let rows = [...data.yc_members];
  rows = rows.sort((a, b) => a.name.localeCompare(b.name));
  const { open, name: memberName, duesOwed: memberDuesOwed, active: memberActive, email: memberEmail } = openDialog;
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={open}
        onClose={() => setOpenDialog({...cleanDialog})}
      >
        <Grid container spacing={3}>
          <DialogTitle>{ memberName }</DialogTitle>
          <Avatar alt="Remy Sharp" src={user?.picture} />
        </Grid>
        <DialogContentText></DialogContentText>
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