
import React from "react";
import { Layout } from "@/components/Layout";
import { RefundExchangeManager } from "@/components/RefundExchangeManager";

const RefundExchangePage = () => {
  return (
    <Layout activeSection="refundsExchanges" onNavigate={() => {}}>
      <RefundExchangeManager />
    </Layout>
  );
};

export default RefundExchangePage;
