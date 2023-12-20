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