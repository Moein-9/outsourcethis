
import { FileInvoice } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguageStore } from "@/store/languageStore";
import { useNavigate } from "react-router-dom";

export const DashboardSupplierTile = () => {
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const isRtl = language === 'ar';

  const translations = {
    title: language === 'ar' ? 'فواتير الموردين' : 'Supplier Invoices',
    description: language === 'ar' 
      ? 'إدارة وتتبع فواتير الموردين' 
      : 'Manage and track supplier invoices',
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate('/supplier-invoices')}
    >
      <CardContent className={`p-5 flex ${isRtl ? 'flex-row-reverse' : 'flex-row'} gap-4 items-center`}>
        <div className="bg-blue-50 rounded-full p-3">
          <FileInvoice className="h-6 w-6 text-blue-600" />
        </div>
        <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
          <h3 className="font-semibold text-base">{translations.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {translations.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
