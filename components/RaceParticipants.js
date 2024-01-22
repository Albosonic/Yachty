import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { GET_ALL_USER_ROOMS_BY_ID } from "@/lib/gqlQueries/dmgql";
import { GET_ALL_YC_MEMBERS, INSERT_ROOM, INSERT_USER_ROOMS } from "@/lib/gqlQueries/allMembersgql";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography, colors } from "@mui/material";
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
import { GET_MEMBERS_BY_RACE_ID } from "@/lib/gqlQueries/membersgql";
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import RacerInfoDialog from "./RacerInfoDialog";


const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'signed_race_releases', label: 'Release', minWidth: 100, isRelease: true },
  { id: 'profilePic', label: 'Pic', minWidth: 100, },
];

const cleanDialog = {
  open: false,
  active: false,
  duesOwed: 0,
  email: '',
  name: '',
  bio: '',
  profilePic: '',
  id: '',
  vessels: [],
  yachtClubByYachtClub: [],
  signed_race_releases: [],
}

const RaceParticipants = ({raceId}) => {
  const router = useRouter();
  const ycId = router.query.ycId;

  const userIsCommodore = useSelector(state => state.auth.user.userIsCommodore);
  const anchor = useRef(null);
  const memberId = useSelector(state => state.auth.member.id);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState({...cleanDialog});

  const { error, loading,  data } = useQuery(GET_MEMBERS_BY_RACE_ID, {
    variables: {
      raceId,
      fetchPolicy: 'no-cache' ,
    },
    pollInterval: 2000,
  });  

  const { data: userRmData, loading: userRmLoading, error: userRmError } = useQuery(GET_ALL_USER_ROOMS_BY_ID, {
    variables: {
      memberId
    },
    pollInterval: 2000,
  });

  const [createDMRoom, { loading: dMRoomLoading }] = useMutation(INSERT_ROOM)
  const [addUserRooms, { loading: userRoomsLoading }] = useMutation(INSERT_USER_ROOMS)

  const handleClose = async () => setOpenDialog({...cleanDialog})

  const scrollToElLeaveSetRow = (row) => {
    if (anchor.current) {
      anchor.current.scrollIntoView({behavior: "smooth"})
    }
    return () => setOpenDialog({...row, open: true })
  }

  const directMessage = async (recipientId) => {
    let roomId = null;
    userRmData.user_rooms.forEach(room => { if (room.recipientId === recipientId) {
      roomId = room.roomId
    }});

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

  if (loading || !data) return <CircularProgress />

  let rows = [...data.yc_members].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <RacerInfoDialog 
        openDialog={openDialog} 
        cleanDialog={cleanDialog} 
        setOpenDialog={setOpenDialog} 
        handleClose={handleClose}
        directMessage={directMessage}
      />
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
                if (i === rows.length -1) {
                  return (


                    <TableRow ref={anchor} onClick={scrollToElLeaveSetRow(row)} hover role="checkbox" tabIndex={-1} key={row.email}>



                      {columns.map((column, i) => {
                        let value = row[column.id];
                        if (column.isRelease && row.signed_race_releases[0]) {
                          let signed = row.signed_race_releases[0]?.releaseFormId;
                          return (
                            <TableCell key={column + i} align={column.align}>
                              {signed && <DownloadDoneIcon color="success" />}
                            </TableCell>
                          )
                        }
                        if (column.id === 'profilePic') {
                          return (
                            <TableCell key={column.id + i + column.label} align={column.align}>
                              <Avatar src={value} />
                            </TableCell>
                          )
                        }
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
                }
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default RaceParticipants;