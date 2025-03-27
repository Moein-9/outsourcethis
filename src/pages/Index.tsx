
import React from "react";
import { PageContainer } from "@/components/PageContainer";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { RecentTransactions } from "@/components/RecentTransactions";
import { UpcomingAppointments } from "@/components/UpcomingAppointments";
import { CreateInvoice } from "@/components/CreateInvoice";

const Index = () => {
  return (
    <PageContainer>
      <CreateInvoice />
    </PageContainer>
  );
};

export default Index;
