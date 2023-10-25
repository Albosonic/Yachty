import NavBar from '@/components/NavBar';
import YCRegions from '@/components/Regions';
YCRegions

const YCApplicants = () => {

  return (
    <div>      
      <NavBar />
        <YCRegions routerPath="/yc_regions/all_yc_by_region" />
    </div>
  );
}

export default YCApplicants;