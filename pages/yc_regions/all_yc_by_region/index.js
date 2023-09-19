import NavBar from "@/components/NavBar";
import YCSelector from "@/components/YCSelector";

const AllYCByRegion = () => {
  return (
    <div>      
      <NavBar />
      <YCSelector routerPath="/yc_regions/all_yc_by_region/yc_applicant_form" />
    </div>
  );
};

export default AllYCByRegion;
