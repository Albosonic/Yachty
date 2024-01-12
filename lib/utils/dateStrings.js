export const getHasuraDate = (value) => {  
  if(!value) return null;
  let month = value.$M + 1
  let date = `${value.$y}-${month}-${value.$D}`
  return date
}