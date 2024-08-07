
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import { Button, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import uuid4 from 'uuid4';
import ClaimSeatDialog from '@/components/dialogsYachty/ClaimSeatDialog';
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_CURRENT_EVENT_SEATING = gql`
  query getEventSeating($eventId: uuid) {
  yc_event_seating(where: {event_id: {_eq: $eventId}}) {
    tables
  }
}
`
const UPDATE_SEATING = gql`
  mutation updateSeating($tables: jsonb) {
  update_yc_event_seating(where: {event_id: {_eq: "f97761d8-aa61-47a3-8604-2471d5baa355"}}, _set: {tables: $tables}) {
    returning {
      tables
    }
  }
}
`;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Seating = () => {
  const [tablesLeft, setablesLeft] = useState([])
  const [tablesRight, settablesRight] = useState(0)
  const [danceFloor, setDancefloor] = useState(0)
  const [savedSeating, setSavedSeating] = useState({})
  const [open, setOpen] = useState({open: false, seat: { tableNumber: null, seatNumber: null }})
  const [stage, setStage] = useState(0)
  const {data, error, loading, refetch} = useQuery(GET_CURRENT_EVENT_SEATING, {variables: {eventId: "f97761d8-aa61-47a3-8604-2471d5baa355"}})
  const [updateTables, {loading: loadingTables }] = useMutation(UPDATE_SEATING)
  console.log('data ======', data)
  const addTable = (side) => {
    if (side === "left") {
      setablesLeft(
        [
          ...tablesLeft,
          {
            tableNumber: tablesLeft.length + 1,
            seats:[],
          }
        ]
      )
    }
  }

  const saveTables = async (newArrangement) => {
    if (tablesLeft.length === 0) return
    await updateTables({variables: { tables: newArrangement }})
    await refetch()
  }

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" sx={{width: "100%"}} >
        <Stack spacing={2}>
          <Grid>
            <Button  onClick={() => addTable("left")}>
              Add Table
            </Button>
            <Button onClick={async ()  => await saveTables(tablesLeft)}>  
              Save
            </Button>
          </Grid>
            <ClaimSeatDialog open={open} setOpen={setOpen} />
            <Stack className='border' direction="row" flexWrap="wrap" width={550} padding={2}>
            {tablesLeft.map((table, i) => {

              return (
                <Stack
                  alignItems="center"
                  className="border border-blue-600 w-[250px] h-[220px]"
                  key={i + uuid4()}
                >
                  <Stack direction="row" >
                    <Tooltip title="seat no. 1">
                      <IconButton onClick={() => setOpen({open: true, seat: {tableNumber: i + 1, seatNumber: 1}})} color='primary' className="relative top-36 left-[180px] rotate-180 " >
                        <EventSeatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="seat no. 2">
                      <IconButton onClick={() => setOpen({open: true, seat: {tableNumber: i + 1, seatNumber: 1}})} color='primary' className="relative top-[135px] left-[100px] -rotate-[140deg]" >
                        <EventSeatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="seat no. 3">
                      <IconButton onClick={() => setOpen({open: true, seat: {tableNumber: i + 1, seatNumber: 1}})} color='primary' className="relative top-[100px] left-[30px] -rotate-[105deg]" >
                        <EventSeatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="seat no. 4">
                      <IconButton onClick={() => setOpen({open: true, seat: {tableNumber: i + 1, seatNumber: 1}})} color='primary' className="relative top-[58px] right-[12px] -rotate-[75deg]" >
                        <EventSeatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="seat no. 5">
                      <IconButton onClick={() => setOpen({open: true, seat: {tableNumber: i + 1, seatNumber: 1}})} color='primary' className="relative top-[18px] right-[25px] -rotate-[40deg]" >
                        <EventSeatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="seat no. 6">
                      <IconButton onClick={() => setOpen({open: true, seat: {tableNumber: i + 1, seatNumber: 1}})} color='primary' className="relative right-[20px] top-1" >
                        <EventSeatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="seat no. 7">
                      <IconButton onClick={() => setOpen({open: true, seat: {tableNumber: i + 1, seatNumber: 1}})} color='primary' className="relative rotate-[40deg] top-4 right-[8px]" >
                        <EventSeatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="seat no. 8">
                      <IconButton onClick={() => setOpen({open: true, seat: {tableNumber: i + 1, seatNumber: 1}})} color='primary' className="relative top-[60px] right-[25px] rotate-[75deg]" >
                        <EventSeatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="seat no. 9">
                      <IconButton onClick={() => setOpen({open: true, seat: {tableNumber: i + 1, seatNumber: 1}})} color='primary' className="relative top-[110px] right-[70px] rotate-[120deg]" >
                        <EventSeatIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="seat no. 10">
                      <IconButton onClick={() => setOpen({open: true, seat: {tableNumber: i + 1, seatNumber: 1}})} color='primary' className="relative top-[140px] right-[140px] rotate-[140deg] " >
                        <EventSeatIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                  <div className="w-28 h-28 border rounded-full">
                    <Typography className='relative top-10 left-7'>{`table ${i + 1}`}</Typography>
                  </div>
                </Stack>
              )
            })}
            </Stack>

        </Stack>
        <Stack>
          <Button>
            Add Dance Floor
          </Button>
        </Stack>
        <Stack>
          <Button>
            Add Table
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Seating