
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, Clock, Eye, Calendar, Activity, 
  TrendingUp, Banknote, ShoppingBag 
} from "lucide-react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { patients } = usePatientStore();
  const { frames } = useInventoryStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Stats calculation
  const totalPatients = patients.length;
  const totalProducts = frames.length;
  const totalIncome = 25000; // Placeholder data
  const pendingAppointments = 7; // Placeholder data

  // Stats cards data
  const statsCards = [
    {
      title: "إجمالي المرضى",
      value: totalPatients,
      icon: <Users className="h-6 w-6 text-primary" />,
      description: "العدد الكلي للمرضى"
    },
    {
      title: "منتجات المخزون",
      value: totalProducts,
      icon: <ShoppingBag className="h-6 w-6 text-green-500" />,
      description: "المنتجات المتوفرة"
    },
    {
      title: "الإيرادات",
      value: `${totalIncome} ر.س`,
      icon: <Banknote className="h-6 w-6 text-blue-500" />,
      description: "إجمالي الإيرادات"
    },
    {
      title: "المواعيد",
      value: pendingAppointments,
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      description: "المواعيد المعلقة"
    }
  ];

  return (
    <div className="py-4 space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-primary/15 to-primary/5 rounded-lg p-6">
        <div>
          <h2 className="text-3xl font-bold text-primary">مرحباً بك في النظام البصري</h2>
          <p className="mt-2 text-gray-600">
            نظام إدارة متكامل للعيادات والمستشفيات
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-md shadow-sm">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-gray-500">الوقت الحالي</p>
            <p className="text-lg font-semibold">{currentTime.toLocaleTimeString('ar-EG')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <Card key={index} className="border-t-4 border-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              النشاط الحديث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 border-b pb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">فحص عين للمريض أحمد محمد</p>
                    <p className="text-sm text-gray-500">قبل {i + 1} ساعات</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              إحصائيات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">المرضى الجدد</span>
                <span className="text-sm font-medium">12 مريض</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">الفحوصات اليومية</span>
                <span className="text-sm font-medium">8 فحص</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">الوصفات الطبية</span>
                <span className="text-sm font-medium">15 وصفة</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
