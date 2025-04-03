
import React from "react";
import { useLanguageStore } from "@/store/languageStore";

export const RemainingPayments: React.FC = () => {
  const { language, t } = useLanguageStore();
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  return (
    <div className="p-6 border rounded-lg bg-slate-50">
      <h2 className={`text-xl font-semibold ${textAlignClass}`}>
        {language === 'ar' ? 'هذه الوظيفة غير متاحة حاليًا' : 'This feature is currently unavailable'}
      </h2>
      <p className={`mt-2 text-muted-foreground ${textAlignClass}`}>
        {language === 'ar' 
          ? 'تم تعطيل هذه الميزة مؤقتًا للاختبار.' 
          : 'This feature has been temporarily disabled for testing purposes.'}
      </p>
    </div>
  );
};
