
import React, { useState, useEffect } from "react";

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-primary mb-4">الصفحة الرئيسية</h2>
      <p className="mb-2">مرحباً بك في النظام البصري.</p>
      <p>الوقت الحالي: <span>{currentTime.toLocaleTimeString('ar-EG')}</span></p>
    </div>
  );
};
