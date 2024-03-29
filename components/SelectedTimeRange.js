import { Typography } from "@mui/material";

const SelectedTimeRange = ({startDate, endDate}) => {
  if (!startDate) return null;
  if (!endDate) return null;
  const startDay = startDate.slice(0, 10);
  const startHrs = startDate.slice(11);
  const endDay = endDate.slice(0, 10);
  const endHrs = endDate.slice(11);
  if (startDay === endDay) return <Typography variant="h6">{`${startDay} ${startHrs} - ${endHrs}`}</Typography>
  return  <Typography variant="h6">{`${startDay} ${startHrs} - ${endDay} ${endHrs}`}</Typography>
}

export default SelectedTimeRange;