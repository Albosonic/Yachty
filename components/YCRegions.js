import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { setYCRegion } from '@/slices/actions/ycInfoActions';
import { GET_ALL_REGIONS } from '@/lib/gqlQueries/regionsgql';
import styles from '@/styles/applicants.module.css';

const YCRegions = ({ routerPath }) => {
  const { data, loading, error } = useQuery(GET_ALL_REGIONS);
  const dispatch = useDispatch();
  const router = useRouter();

  if (loading) return <CircularProgress />
  if (error) router.push('/login');

  const {regions} = data;

  const handleChange = (event) => {
    const selectedRegion = event.target.value;
    dispatch(setYCRegion(selectedRegion));
    router.push({
      pathname: routerPath,
      query: { regionId: event.target.value.id }
    })
  }

  return (
    <div className={styles.center}>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="regions-selector-label">Regions</InputLabel>
          <Select
            labelId="region-select-label"
            id="region-simple-select"
            value={''}
            label="Region"
            onChange={handleChange}
          >
            {regions.map((region, index) => {
              return <MenuItem key={`${region.id}${index}`} value={region}>{region.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>
    </div>
  );
}

export default YCRegions;