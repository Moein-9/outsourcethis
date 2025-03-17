
import React from "react";
import { Layout } from "@/components/Layout";
import { DailySalesReport } from "@/components/reports/DailySalesReport";
import { ComparativeAnalysis } from "@/components/reports/ComparativeAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const ReportPage: React.FC = () => {
  return (
    <Layout activeSection="reports" onNavigate={() => {}}>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">تقارير النظام</h1>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-2 mb-4">
            <TabsTrigger value="daily">التقرير اليومي</TabsTrigger>
            <TabsTrigger value="comparative">التحليل المقارن</TabsTrigger>
          </TabsList>

          <Card>
            <CardContent className="pt-6">
              <TabsContent value="daily" className="mt-0">
                <DailySalesReport />
              </TabsContent>

              <TabsContent value="comparative" className="mt-0">
                <ComparativeAnalysis />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ReportPage;
