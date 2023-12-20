import CalendarDayClickMenu from "@/components/CalendarDayClickMenu";
import LoadingYachty from "@/components/LoadingYachty";
import NavBar from "@/components/NavBar";
import { Scheduler } from "@aldabil/react-scheduler";
import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { useRef } from "react";
import { useSelector } from "react-redux";
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

const GET_ALL_CALENDAR_EVENTS = gql`
query getAllCalendarEvents($ycId: uuid!) {
  races(where: {ycId: {_eq: $ycId}}) {
    raceName
    endTime
    endDate
    startDate
    startTime
    id
  }
  yc_events(where: {ycId: {_eq: $ycId}}) {
    event_name
    startDate
    id
  }
}`;

const useAllCallendarEvents = () => {
  let events = [];
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);  
  const {error, loading, data} = useQuery(GET_ALL_CALENDAR_EVENTS, {variables: { ycId }});
  if (loading) return {error, loading, data};

  data.races.forEach(race => {
    const {id, raceName, startDate, startTime, endDate, endTime } = race;
    let splitStartDate = startDate.split('-');
    let splitEndtDate = endDate.split('-');        
    let startFix = `${splitStartDate[0]}/${splitStartDate[1]}/${splitStartDate[2]} ${startTime}`
    let endFix = `${splitEndtDate[0]}/${splitEndtDate[1]}/${splitEndtDate[2]} ${endTime}`    
    let event = {
      event_id: id,
      title: raceName,
      start: new Date(startFix),
      end: new Date(endFix),
    }
    events.push(event);
  });
  data.yc_events.forEach(ycEvent => {
    const {id, event_name: eventName, startDate} = ycEvent;
    let splitStartDate = startDate.split('-');
    let startFix = `${splitStartDate[0]}/${splitStartDate[1]}/${splitStartDate[2]}`  
    let event = {
      event_id: id,
      title: eventName,
      start: new Date(startFix),
      end: new Date(startFix),
    }    
    events.push(event);
  })

  return {error, loading, events};
}

const Calendar = () => {
  const calendarRef = useRef(null);
  const {error, loading, events} = useAllCallendarEvents();
  if (loading) return <LoadingYachty />
  // console.log('events =============', events)

  return (
    <>
      <NavBar />
      <Scheduler
        view="month"
        ref={calendarRef}
        events={events}
        customEditor={(scheduler) => <CalendarDayClickMenu scheduler={scheduler} />}
      />
    </>
  )
}

export default Calendar;
