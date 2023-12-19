import NavBar from "@/components/NavBar";
import { Scheduler } from "@aldabil/react-scheduler";
import { useRef } from "react";

const Calendar = () => {
  const calendarRef = useRef(null);
  

  return (
    <>
      <NavBar />
      <Scheduler 
        view="month"
        ref={calendarRef}
      />      
    </>
  )
}

export default Calendar;