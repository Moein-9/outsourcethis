
import { UserPlus, Receipt, Package, CreditCard, Search, RefreshCcw, BarChart3, FileInvoice } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { DashboardSupplierTile } from "@/components/supplier/DashboardSupplierTile";

export const getDashboardTiles = (onNavigate: (section: string) => void) => {
  const { t, language } = useLanguageStore();
  
  const primaryTiles = [
    {
      title: t('createClient'),
      icon: UserPlus,
      description: t('createClientDesc'),
      onClick: () => onNavigate('createClient'),
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      title: t('createInvoice'),
      icon: Receipt,
      description: t('createInvoiceDesc'),
      onClick: () => onNavigate('createInvoice'),
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: t('inventory'),
      icon: Package,
      description: t('inventoryDesc'),
      onClick: () => onNavigate('inventory'),
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];
  
  const secondaryTiles = [
    {
      title: t('remainingPayments'),
      icon: CreditCard,
      description: t('remainingPaymentsDesc'),
      onClick: () => onNavigate('remainingPayments'),
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      title: t('patientSearch'),
      icon: Search,
      description: t('patientSearchDesc'),
      onClick: () => onNavigate('patientSearch'),
      bgColor: 'bg-sky-50',
      iconColor: 'text-sky-600',
    },
    {
      title: language === 'ar' ? 'الاسترداد والاستبدال' : 'Refunds & Exchanges',
      icon: RefreshCcw,
      description: language === 'ar' ? 'إدارة عمليات الاسترداد والاستبدال' : 'Manage refunds and exchanges',
      onClick: () => onNavigate('refundManager'),
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];
  
  // Special tile components (these are React components, not just configuration objects)
  const specialTiles = [
    <DashboardSupplierTile key="supplierInvoice" />,
    {
      title: language === 'ar' ? 'التقارير' : 'Reports',
      icon: BarChart3,
      description: language === 'ar' ? 'عرض وإنشاء التقارير' : 'View and generate reports',
      onClick: () => onNavigate('reports'),
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
  ];
  
  return { primaryTiles, secondaryTiles, specialTiles };
};
