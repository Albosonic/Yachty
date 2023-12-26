import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import AttendeeDialog from "../dialogsYachty/AttendeeDialog";



const AttendeesTable = ({ columns, data, totalAttendees, totalAttendeeDinners }) => {  
  const dispatch = useDispatch();
  const memberId = useSelector(state => state.auth.member.id);
  const [openDialog, setOpenDialog] = useState({open: false});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);  

  

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleClose = async () => {
    setOpenDialog({...cleanDialog})
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };  

  let rows = [...data.yc_members].sort((a, b) => a.name.localeCompare(b.name));  
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <AttendeeDialog setOpenDialog={setOpenDialog} data={openDialog} />
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
                  <TableRow onClick={() => setOpenDialog({ ...row, open: true })} hover role="checkbox" tabIndex={-1} key={row.email}>
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
        <Grid container justifyContent="space-between">
          <Typography sx={{padding: 1}}>Total Attendees {totalAttendees}</Typography>
          <Typography sx={{padding: 1}}>Total Dinners {totalAttendeeDinners}</Typography>
        </Grid>
      }
    </Paper>
  );
}

export default AttendeesTable;