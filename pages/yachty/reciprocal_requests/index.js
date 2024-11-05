import MemberRequests from "@/components/MemberRequestsView";
import NavBar from '@/components/NavBar';
import withAuthGaurd from "@/hocees/withAuthCusom";

const ReciprocalRequests = () => {
  return (
    <>
      <NavBar />
      <MemberRequests />
    </>
  )
}

export default withAuthGaurd(ReciprocalRequests);