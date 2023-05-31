import { useState } from 'react';
import NavBar from '@/components/NavBar';
import styles from '@/styles/YCApplicants.module.css'
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import YCRegions from '@/components/YCRegions';

const YCApplicants = () => {

  return (
    <div>      
      <NavBar />
        <YCRegions routerPath="/yc_regions/all_yc_by_region" />
    </div>
  );
}

export default YCApplicants;