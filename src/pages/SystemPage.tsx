
import React from 'react';
import { Layout } from '@/components/Layout';
import { DataSynchronizer } from '@/components/DataSynchronizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguageStore } from '@/store/languageStore';
import { InventoryInitializer } from '@/components/InventoryInitializer';

export default function SystemPage() {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  return (
    <Layout>
      <div className={`container mx-auto p-4 ${isRtl ? 'rtl' : 'ltr'}`}>
        <h1 className="text-2xl font-bold mb-6">
          {isRtl ? 'إدارة النظام' : 'System Management'}
        </h1>
        
        <Tabs defaultValue="data-sync" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="data-sync">
              {isRtl ? 'مزامنة البيانات' : 'Data Synchronization'}
            </TabsTrigger>
            <TabsTrigger value="system-info">
              {isRtl ? 'معلومات النظام' : 'System Information'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-sync" className="space-y-6">
            <DataSynchronizer />
          </TabsContent>
          
          <TabsContent value="system-info">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isRtl ? 'معلومات النظام' : 'System Information'}
                </CardTitle>
                <CardDescription>
                  {isRtl ? 'معلومات عن إصدار النظام والتكوين' : 'Information about system version and configuration'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded p-4">
                    <h3 className="font-medium mb-2">
                      {isRtl ? 'إصدار التطبيق' : 'Application Version'}
                    </h3>
                    <p>1.0.0</p>
                  </div>
                  
                  <div className="border rounded p-4">
                    <h3 className="font-medium mb-2">
                      {isRtl ? 'قاعدة البيانات' : 'Database'}
                    </h3>
                    <p>Supabase</p>
                  </div>
                  
                  <div className="border rounded p-4">
                    <h3 className="font-medium mb-2">
                      {isRtl ? 'وضع التخزين' : 'Storage Mode'}
                    </h3>
                    <p>
                      {isRtl ? 'محلي مع مزامنة Supabase' : 'Local with Supabase sync'}
                    </p>
                  </div>
                  
                  <div className="border rounded p-4">
                    <h3 className="font-medium mb-2">
                      {isRtl ? 'آخر مزامنة' : 'Last Sync'}
                    </h3>
                    <p>-</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Load inventory initializer */}
      <InventoryInitializer />
    </Layout>
  );
}
