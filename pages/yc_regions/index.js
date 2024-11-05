import NavBar from '@/components/NavBar';
import YCRegions from '@/components/Regions';
import withAuthGaurd from '@/hocees/withAuthCusom';
YCRegions

const YCApplicants = () => {

  return (
    <div>      
      <NavBar />
        <YCRegions routerPath="/yc_regions/all_yc_by_region" />
    </div>
  );
}

export default withAuthGaurd(YCApplicants);