import AllMembersTable from "@/components/tablesYachty/AllMembers/AllMembersTable";
import LoadingYachty from "@/components/LoadingYachty";
import NavBar from "@/components/NavBar";
import { GET_ALL_YC_MEMBERS } from "@/lib/gqlQueries/allMembersgql";
import { useQuery } from "@apollo/client";
import { useSelector } from "react-redux";

const columns = [
  { id: 'profilePic', label: 'pic', minWidth: 170 },
  { id: 'name', label: 'Name', minWidth: 170 },
  // { id: 'email', label: 'Email', minWidth: 100 },
  // { id: 'vessels', label: 'Vessel Name', nestedKey: 'vesselName', minWidth: 170 },
  // { id: 'vessels', label: 'Vessel Type', nestedKey: 'type', minWidth: 170 },
];

const ViewAllMembers = () => {
  const ycId = useSelector(state => state.auth.member.yachtClubByYachtClub.id);
  const { error, loading,  data } = useQuery(GET_ALL_YC_MEMBERS, { variables: { ycId, fetchPolicy: 'no-cache' } });
  if (loading) return <LoadingYachty />  
  return (
    <>
      <NavBar />
      <AllMembersTable columns={columns} data={data} />
    </>
  )
};

export default ViewAllMembers;