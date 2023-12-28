import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CreateSeriesDialog from './makenewRace/dialogs/CreateSeriesDialog';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { GET_RACE_SERIES_BY_YC_ID } from '@/lib/gqlQueries/racinggql';
import LoadingYachty from './LoadingYachty';

const RaceSeriesMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonText, setButtonText] = useState('Choose Race Series');
  const [creatingSeries, setCreatingSeries] = useState(false);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id)
  const {error: getSeriesError, loading: getSeriesLoading, data: raceSeriesData, refetch: refetchRaceSeries} = useQuery(GET_RACE_SERIES_BY_YC_ID, {
    variables: { ycId },
    fetchPolicy: 'no-cache'
  });

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (series) => {
    setAnchorEl(null);
    // if (series?.id) setSeries(series);
  };

  const createSeries = () => {
    handleClose();
    setCreatingSeries(true);
  }

  if (getSeriesLoading) return <LoadingYachty isRoot={false} />
  const seriesArr = raceSeriesData?.race_series

  return (
    <>
      <CreateSeriesDialog open={creatingSeries} setOpen={setCreatingSeries} refetch={refetchRaceSeries} />
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