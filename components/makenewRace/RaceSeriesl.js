
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CreateSeriesDialog from './dialogs/CreateSeriesDialog';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { GET_RACE_SERIES_BY_YC_ID } from '@/lib/gqlQueries/racinggql';

import { RACE_FIELDS, makeNewRaceFieldAct } from '@/slices/actions/workingRaceActions';
import LoadingYachty from '../LoadingYachty';


const SetRaceSeries = ({callback}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [buttonText, setButtonText] = useState('Choose Race Series');
  const [creatingSeries, setCreatingSeries] = useState(false);
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id)
  const {error: getSeriesError, loading: getSeriesLoading, data: raceSeriesData, refetch: refetchRaceSeries} = useQuery(GET_RACE_SERIES_BY_YC_ID, {
    variables: { ycId },
    fetchPolicy: 'no-cache'
  });

  const open = Boolean(anchorEl);
  const {RACE_NAME} = RACE_FIELDS
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const chooseSeries = (series) => {
    dispatch(makeNewRaceFieldAct({series: series}))
    callback(RACE_NAME)
  }

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
        size='large'
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
        {seriesArr.map((series, i) => <MenuItem key={series.seriesName + i} onClick={() => chooseSeries(series)}>{series.seriesName}</MenuItem>)}
        <MenuItem key="create series" onClick={createSeries}>{'...create series'}</MenuItem>
      </Menu>
    </>
  );
}

export default SetRaceSeries;