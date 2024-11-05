import NavBar from '@/components/NavBar';
import ReciprocalYachtClubView from '@/components/ReciprocalYachClubView';
import withAuthGaurd from '@/hocees/withAuthCusom';

const RequestReciprocalClub = () => {

  return (
    <>
      <NavBar />
      <ReciprocalYachtClubView />
    </>
  )
}

export default withAuthGaurd(RequestReciprocalClub);