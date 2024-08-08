
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
import { useRouter } from 'next/router';

const GET_CURRENT_EVENT_SEATING = gql`
  query getEventSeating($eventId: uuid) {
    yc_event_seating(where: {event_id: {_eq: $eventId}}) {
    tables
  }
}
`
const UPDATE_SEATING = gql`
  mutation updateSeating($tables: jsonb, $eventId: uuid) {
  update_yc_event_seating(where: {event_id: {_eq: $eventId}}, _set: {tables: $tables}) {
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
  const router = useRouter()
  const eventId = router.query.eventId

  const [tablesLeft, setTablesLeft] = useState([])
  const [tablesRight, setTablesRight] = useState([])
  const [danceFloor, setDancefloor] = useState(0)
  const [savedSeating, setSavedSeating] = useState({})
  const [open, setOpen] = useState({open: false, seat: { left: null, tableNumber: null, seatNumber: null }})
  const [stage, setStage] = useState(0)
  const {data: currentSeating, error, loading, refetch} = useQuery(GET_CURRENT_EVENT_SEATING, {variables: {eventId}})
  const [updateTables, {loading: loadingTables }] = useMutation(UPDATE_SEATING)

  useEffect(() => {
    let tablesLeft = []
    let tablesRight = []
    const tables = currentSeating?.yc_event_seating[0]?.tables
    if (tables) {
      tables.forEach(table => {
        if (table.left) {
          tablesLeft.push(table)
        } else {
          tablesRight.push(table)
        }
      })
      setTablesLeft([...tablesLeft])
      setTablesRight([...tablesRight])
    }
  }, [currentSeating])

  const addTable = (side) => {
    if (side === "left") {
      setTablesLeft(
        [
          ...tablesLeft,
          {
            tableNumber: tablesLeft.length + 1,
            seats:[],
            left: true,
          }
        ]
      )
    }
    if (side === "right") {
      setTablesRight(
        [
          ...tablesRight,
          {
            tableNumber: tablesRight.length + 1,
            seats: [],
            right: true,
          }
        ]
      )
    }
  }

  const saveTables = async (newArrangement) => {
    if (newArrangement.length === 0) return
    const resp = await updateTables({variables: {eventId, tables: newArrangement }})
    await refetch()
  }

  const reserveSeat = (seat, name) => {
    const { seat: { side, tableNumber, seatNumber }} = seat
    let tablesLeftCopy = structuredClone(tablesLeft)
    if (side === 'left') {      
      tablesLeftCopy.forEach(table => {
        if (tableNumber === table.tableNumber) {          
          table.seats[seatNumber - 1] = name          
        }
      })      
    }    
    setOpen({open: false, tableNumber: null, seatNumber: null, side: null })
    saveTables(tablesLeftCopy)
  }  
  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" sx={{width: "100%"}} >
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="center" padding={2}>
            <Button  onClick={() => addTable("left")}>
              Add Table
            </Button>
            <Button onClick={async ()  => await saveTables(tablesLeft)}>
              Save
            </Button>
          </Stack>
          <ClaimSeatDialog open={open} reserveSeat={reserveSeat} />
          <Stack className='border' direction="row" flexWrap="wrap" width={550} padding={2}>
            {tablesLeft.map((table, tableIndex) => {
              const seatClasses = [
                "relative top-36 left-[180px] rotate-180",
                "relative top-[135px] left-[100px] -rotate-[140deg]",
                "relative top-[100px] left-[30px] -rotate-[105deg]",
                "relative top-[58px] right-[12px] -rotate-[75deg]",
                "relative top-[18px] right-[25px] -rotate-[40deg]",
                "relative right-[20px] top-1",
                "relative rotate-[40deg] top-4 right-[8px]",
                "relative top-[60px] right-[25px] rotate-[75deg]",
                "relative top-[110px] right-[70px] rotate-[120deg]",
                "relative top-[140px] right-[140px] rotate-[140deg]",
              ]
              return (
                <Stack
                  alignItems="center"
                  className="border border-blue-600 w-[250px] h-[220px]"
                  key={tableIndex + uuid4()}
                >
                  <Stack direction="row" >
                    {seatClasses.map((classes, i) => {
                      return (
                        <Tooltip key={classes} title={`seat no. ${i + 1} ${table.seats[i]}`}>
                          <IconButton onClick={() => setOpen({open: true, seat: { tableNumber: tableIndex + 1, seatNumber: 1, side: "left" }})} color='primary' className={classes} >
                            <EventSeatIcon />
                          </IconButton>
                        </Tooltip>
                      )})
                    }
                  </Stack>
                  <div className="w-28 h-28 border rounded-full">
                    <Typography className='relative top-10 left-7'>{`table ${tableIndex + 1}`}</Typography>
                  </div>
                </Stack>
              )
            })}
          </Stack>
        </Stack>
        <Stack spacing={2} className='mt-5' alignItems="center">
          <Box className="border flex items-center justify-center" width={200} height={100} >
            <Typography className='self-center'>
              Stage
            </Typography>
          </Box>
          <Box className="border flex items-center justify-center" width={300} height={300} >
            <Typography className='self-center'>
              Dance Floor
            </Typography>
          </Box>
          <Box className="border flex items-center justify-center" width={300} height={100} >
            <Typography className='self-center'>
              Bar
            </Typography>
          </Box>
        </Stack>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="center" padding={2}>
            <Button  onClick={() => addTable("right")}>
              Add Table
            </Button>
            <Button onClick={async ()  => await saveTables(tablesLeft)}>
              Save
            </Button>
          </Stack>
          <ClaimSeatDialog open={open} reserveSeat={reserveSeat} />
          <Stack className='border' direction="row" flexWrap="wrap" width={550} padding={2}>
            {tablesRight.map((table, tableIndex) => {
              const seatClasses = [
                "relative top-36 left-[180px] rotate-180",
                "relative top-[135px] left-[100px] -rotate-[140deg]",
                "relative top-[100px] left-[30px] -rotate-[105deg]",
                "relative top-[58px] right-[12px] -rotate-[75deg]",
                "relative top-[18px] right-[25px] -rotate-[40deg]",
                "relative right-[20px] top-1",
                "relative rotate-[40deg] top-4 right-[8px]",
                "relative top-[60px] right-[25px] rotate-[75deg]",
                "relative top-[110px] right-[70px] rotate-[120deg]",
                "relative top-[140px] right-[140px] rotate-[140deg]",
              ]
              return (
                <Stack
                  alignItems="center"
                  className="border border-blue-600 w-[250px] h-[220px]"
                  key={tableIndex + uuid4()}
                >
                  <Stack direction="row" >
                    {seatClasses.map((classes, i) => {
                      return (
                        <Tooltip key={classes} title={`seat no. ${i + 1} ${table.seats[i]}`}>
                          <IconButton onClick={() => setOpen({open: true, seat: { tableNumber: tableIndex + 1, seatNumber: 1, side: "left" }})} color='primary' className={classes} >
                            <EventSeatIcon />
                          </IconButton>
                        </Tooltip>
                      )})
                    }
                  </Stack>
                  <div className="w-28 h-28 border rounded-full">
                    <Typography className='relative top-10 left-7'>{`table ${tableIndex + 1}`}</Typography>
                  </div>
                </Stack>
              )
            })}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Seating
