
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

// As a mission driven software engineer I am a team player who always strives to make a meaningful impact. Although I have many years of experience as a Frontend Engineer. I make continuous learning a habit in my daily life. Time management and team work are key skills that I have honed over the years and continue to build on. Even though It is important in software development to be autonomous at times and focus on precise details, I feel that one must also keep the team in mind, and remember to circle back and communicate intent and progress, and to make sure that the teams mission remains on track, and that other members of the team are supported where they need it. We must leave our ego at the door and move together towards our common goals. As a father and family man I appreciate work life balance and company culture that supports those values.

// Having 8+ years of experience collaborating with Designers, Product Managers and Backend Engineers to  develop complex user interfaces in various technologies such as React, Typescript, various css frameworks, AWS, and several other technologies, I feel that I am a good fit for this position. I have also build Software  for medical devices in the past at Penumbra inc. Which makes me uniquely qualified for this role. Since I know that I am passionate about helping people through the application of my technical skills in the healthcare field. I hope very much to be considered for this role, and would love the opportunity to meet the team, and talk about the work that I have done, and my eagerness to join.

// Thank you for your time in reading this,

// Alberto Madueno

// Experienced Software Engineer