import { useState } from "react";
import MemberRequests from "@/components/MemberRequestsView";
import VisitorRequestsView from "@/components/VisitorRequestsView";
import NavBar from '@/components/NavBar';
import { Button, Stack } from "@mui/material";

const ReciprocalVisitors = () => {
  return (
    <>
      <NavBar />
      <VisitorRequestsView />
    </>
  )
}

export default ReciprocalVisitors;