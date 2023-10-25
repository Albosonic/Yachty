import NavBar from '@/components/NavBar';
import YCRegions from '@/components/ycRegions';

const YCApplicants = () => {

  return (
    <div>      
      <NavBar />
        <YCRegions routerPath="/yc_regions/all_yc_by_region" />
    </div>
  );
}

export default YCApplicants;