
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
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
    </div>
  );
};
