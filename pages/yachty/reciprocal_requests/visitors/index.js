import VisitorRequestsView from "@/components/VisitorRequestsView";
import NavBar from '@/components/NavBar';
import withAuthGaurd from "@/hocees/withAuthCusom";

const ReciprocalVisitors = () => {
  return (
    <>
      <NavBar />
      <VisitorRequestsView />
    </>
  )
}

export default withAuthGaurd(ReciprocalVisitors);