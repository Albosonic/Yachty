import { GET_RACE_SERIES_BY_YC_ID } from "@/lib/gqlQueries/racinggql";
import RaceSeriesMenu from "../RaceSeriesMenu";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import LoadingYachty from "../LoadingYachty";

const SetRaceSeries = () => {    
  return (
    <RaceSeriesMenu />
  )
}

export default SetRaceSeries;