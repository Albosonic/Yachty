import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const RaceSeriesMenu = ({seriesArr, setSeries, setCreatingSeries}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonText, setButtonText] = useState('Choose Race Series');

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (series) => {
    setAnchorEl(null);
    if (series?.id) setSeries(series);
  };

  const createSeries = () => {
    handleClose();
    setCreatingSeries(true);
  }

  return (
    <>
      <Button
        id="course-select-button"
        aria-controls={open ? 'race-course-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant='contained'
        endIcon={<ArrowDropDownIcon />}
      >
        {buttonText}
      </Button>
      <Menu
        id="course-selector"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'course-select',
        }}
      >
        {seriesArr.map((series, i) => <MenuItem key={series.seriesName + i} onClick={() => handleClose(series)}>{series.seriesName}</MenuItem>)}
        <MenuItem key="create series" onClick={createSeries}>{'...create series'}</MenuItem>
      </Menu>
    </>
  );
}

export default RaceSeriesMenu;