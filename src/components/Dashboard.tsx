
import React, { useState, useEffect } from "react";
import { Clock, Users, Package, FileText, CreditCard, Search, RefreshCcw } from "lucide-react";
import { usePatientStore } from "@/store/patientStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoenLogoGreen } from "@/assets/logo";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { patients } = usePatientStore();
  const { frames } = useInventoryStore();
  const { t, language } = useLanguageStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const menuCards = [
    {
      title: t('createClient'),
      description: t('createClientDesc') || "Register new customers and manage their details",
      icon: <Users className="h-8 w-8 text-indigo-500" />,
      color: "bg-indigo-50 text-indigo-700",
      path: "createClient"
    },
    {
      title: t('createInvoice'),
      description: t('createInvoiceDesc') || "Create new sales invoices and work orders",
      icon: <FileText className="h-8 w-8 text-emerald-500" />,
      color: "bg-emerald-50 text-emerald-700",
      path: "createInvoice"
    },
    {
      title: t('inventory'),
      description: t('inventoryDesc') || "Manage frames, lenses and stock items",
      icon: <Package className="h-8 w-8 text-amber-500" />,
      color: "bg-amber-50 text-amber-700",
      path: "inventory"
    },
    {
      title: t('remainingPayments'),
      description: t('remainingPaymentsDesc') || "Process pending payments",
      icon: <CreditCard className="h-8 w-8 text-rose-500" />,
      color: "bg-rose-50 text-rose-700",
      path: "remainingPayments"
    },
    {
      title: t('patientSearch'),
      description: t('patientSearchDesc') || "Find customers and view their history",
      icon: <Search className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-50 text-blue-700",
      path: "patientSearch"
    },
    {
      title: t('refundExchange'),
      description: t('refundExchangeDesc') || "Process refunds and exchanges",
      icon: <RefreshCcw className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50 text-purple-700",
      path: "refundExchange"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-primary">{t('welcome')}</h2>
          <p className="text-gray-600 max-w-xl">
            {t('systemDescription')}
          </p>
          <div className="pt-2">
            <Link to="/reports">
              <Button className="rounded-lg shadow-sm">{t('reportsPage')}</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <MoenLogoGreen className="w-auto h-32 mb-4" />
          <div className="flex items-center gap-3 bg-white/90 px-4 py-2 rounded-lg shadow-sm">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-gray-500">{t('currentTime')}</p>
              <p className="text-lg font-semibold force-ltr-numbers">{currentTime.toLocaleTimeString('en-US')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuCards.map((card, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-md transition-all duration-200 border-gray-200">
            <CardHeader className={`p-4 ${card.color}`}>
              <div className="flex items-center gap-3">
                {card.icon}
                <CardTitle>{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="text-base mb-3">{card.description}</CardDescription>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = `/?section=${card.path}`}>
                {t('open')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
