export const getIsoDate = (inputDate) => {  
  const date = inputDate || new Date();
  const dateIso = date.toISOString().slice(0, 10);
  return dateIso;
}

export const getNormalCalanderDate = (value) => {  
  const string = value.toString();  
  const monthAndDay = string.slice(5, 10);
  const splitMonthDay = monthAndDay.split('-');  
  const year = string.slice(0, 4);    
  const normalDate = `${splitMonthDay[0]}/${splitMonthDay[1]}/${year}`;  
  return normalDate;  
}

export const getNormalDateFromDaysjsString = (value) => {

  // TODO: dates need work, unify everything with daysjs
  value = new Date(value).toString();    
  if (!value) return '';
  const fullDay = value.slice(0, 11)
  const hour = value.slice(15, 18)
  const minutes = value.slice(18, 21)
  // console.log('hour =======', hour)
  let normalHour = hour%12;
  // console.log('normal hour =======', normalHour)
  let suffix = '';  
  if (normalHour === 0) {
    suffix = hour === 24 ? 'AM' : 'PM'
    normalHour = 12;
  } else {
    suffix = hour <= 11 ? 'AM' : 'PM'
  }  
  const date = {
    fullDay,
    time: `${normalHour}${minutes} ${suffix}`
  }
  return date;
}
