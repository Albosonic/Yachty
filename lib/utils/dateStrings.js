export const getHasuraDate = (value) => {  
  if(!value) return null;
  let month = value.$M + 1
  let date = `${value.$y}-${month}-${value.$D}`
  return date
}

export const getFriendlyDateAndTime = (startDate, endDate, startTime, endTime) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const friendlyStartDay = start.toString().slice(0, 10)
  const friendlyEndDate = end.toString().slice(0, 10)
  if (startDate === endDate) {
    return `${friendlyStartDay} ${startTime} - ${endTime}`
  } else {
    return `${friendlyStartDay} ${startTime} - ${friendlyEndDate} ${endTime}`
  }
}