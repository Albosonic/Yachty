import CalendarDayClickMenu from "@/components/CalendarDayClickMenu";
import NavBar from "@/components/NavBar";
import { Scheduler } from "@aldabil/react-scheduler";
import { Typography } from "@mui/material";
import { useRef } from "react";
// const action: EventActions = selectedEvent?.event_id ? "edit" : "create";
// interface CalendarEvent {
//   event_id: number | string;
//   title: string;
//   start: Date;
//   end: Date;
//   disabled?: boolean;
//   color?: string;
//   textColor?: string;
//   editable?: boolean;
//   deletable?: boolean;
//   draggable?: boolean;
//   allDay?: boolean;
// }
const Calendar = () => {
  const calendarRef = useRef(null);
  
  // const confirm = (action, event) => {
  //   console.log('action ==========: ', action)
  //   console.log('event ============: ', event )
  // }

  return (
    <>
      <NavBar />
      <Scheduler 
        view="month"
        ref={calendarRef}
        // onConfirm={confirm}
        customEditor={(scheduler) => <CalendarDayClickMenu scheduler={scheduler} />}        
      />      
    </>
  )
}

export default Calendar;
