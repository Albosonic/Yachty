import NavBar from '@/components/NavBar';
import YCSelector from '@/components/YCSelector';
import withAuthGaurd from '@/hocees/withAuthCusom';


const RequestReciprocalClub = () => {

  return (
    <>
      <NavBar />
      <YCSelector routerPath="/yachty/request_reciprocity/select_club/club" />
    </>
  )
}

export default withAuthGaurd(RequestReciprocalClub);