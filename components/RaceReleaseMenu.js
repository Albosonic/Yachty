import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useSelector } from 'react-redux';
import { gql, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import LoadingYachty from './LoadingYachty';
import CreateReleaseDialog from './CreateReleaseDialog';

const GET_RELEASE_FORMS_BY_YC_ID = gql`
  query getReleaseForms($ycId: uuid!) {
  race_release_forms(where: {yachtClubId: {_eq: $ycId}}) {
    id
    name
  }
}`;

const RaceReleaseMenu = ({ addReleaseForm }) => {

  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const {error, loading, data, refetch} = useQuery(GET_RELEASE_FORMS_BY_YC_ID, {
    variables: { ycId },
    fetchPolicy: 'no-cache'
  });
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (form) => {
    setAnchorEl(null);
    if (form) addReleaseForm(form)
  };

  if (loading) return <LoadingYachty />;
  const releaseForms = data?.race_release_forms;
  return (
    <>
      <CreateReleaseDialog open={openDialog} setOpenDialog={setOpenDialog} closeMenu={setAnchorEl} refetch={refetch} />
      <Button
        id="course-select-button"
        aria-controls={open ? 'race-course-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="contained"        
        endIcon={<ArrowDropDownIcon />}
        sx={{minWidth: 223}}
      >
        Release Form 
      </Button>
      <Menu
        id="course-selector"
        anchorEl={anchorEl}
        open={open}
        
        MenuListProps={{
          'aria-labelledby': 'course-select',
        }}
      >
        {releaseForms.map((form, i) => <MenuItem key={form.name + i} onClick={() => handleClose(form)}>{form.name}</MenuItem>)}
        <MenuItem onClick={() => setOpenDialog(true)}>...Create Release Form</MenuItem>
      </Menu>
    </>
  );
}

export default RaceReleaseMenu;