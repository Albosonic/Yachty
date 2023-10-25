import NavBar from '@/components/NavBar';
import YCRegions from '@/components/Regions';

const RequestReciprocity = () => {
  return (
    <>
      <NavBar />
      <YCRegions routerPath="/yachty/request_reciprocity/select_club" />
    </>
  )
}

export default RequestReciprocity;