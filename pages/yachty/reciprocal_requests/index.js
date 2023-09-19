import { useState } from "react";
import { Button, Stack } from "@mui/material";
import MemberRequests from "@/components/MemberRequestsView";
import NavBar from '@/components/NavBar';

const ReciprocalRequests = () => {
  return (
    <>
      <NavBar />
      <MemberRequests />
    </>
  )
}

export default ReciprocalRequests;