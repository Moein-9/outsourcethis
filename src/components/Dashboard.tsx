
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { patients } = usePatientStore();
  const { frames } = useInventoryStore();
  const { t, language } = useLanguage();

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
          <h2 className="text-3xl font-bold text-primary">{t("welcome")}</h2>
          <p className="mt-2 text-gray-600">
            {t("description")}
          </p>
          <div className="mt-4">
            <Link to="/reports">
              <Button>{t("reports")}</Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/80 px-4 py-2 rounded-md shadow-sm">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-gray-500">{t("current_time")}</p>
            <p className="text-lg font-semibold">{currentTime.toLocaleTimeString('en-US')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
