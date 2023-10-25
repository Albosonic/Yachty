import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { GET_ALL_YC_BY_REGION } from "@/lib/gqlQueries/regionsgql";
import styles from '@/styles/YCApplicants.module.css'

const YCSelector = ({ routerPath }) => {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ALL_YC_BY_REGION, { variables: { regionId: router.query.regionId } });
  const homeYcId = useSelector(state => state?.auth?.member?.yachtClubByYachtClub?.id);
  // do this in a useEffect
  if (loading) return <CircularProgress />
  if (error || !data) router.push('/login');

  const yachtClubs = data.yacht_clubs;
  const handleChange = (event) => {
    const { id, name } = event.target.value;
    router.push({
      pathname: routerPath,
      query: { ycid: id, ycname: name }
    })
  }

  return (
    <div className={styles.center}>
      <h1 className={styles.titleSection}>Select a Club</h1>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="regions-selector-label">yacht clubs</InputLabel>
          <Select
            labelId="region-select-label"
            id="region-simple-select"
            value={''}
            label="Region"
            onChange={handleChange}
          >
            {yachtClubs.map((yc, index) => {
              if (yc.id === homeYcId) return null;
              return <MenuItem key={`${yc.id}${index}`} value={yc}>{yc.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      </Box>
    </div>
  )
}

export default YCSelector;