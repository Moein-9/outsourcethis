
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  // Header 
  "system_name": {
    ar: "النظام البصري",
    en: "Optical System"
  },
  "dashboard": {
    ar: "الرئيسية",
    en: "Dashboard"
  },
  "create_client": {
    ar: "إنشاء عميل",
    en: "Create Client"
  },
  "create_invoice": {
    ar: "إنشاء فاتورة",
    en: "Create Invoice"
  },
  "inventory": {
    ar: "إدارة المخزون",
    en: "Inventory"
  },
  "remaining": {
    ar: "المتبقي",
    en: "Remaining"
  },
  "search_patient": {
    ar: "بحث عن عميل",
    en: "Client Search"
  },
  
  // Dashboard
  "welcome": {
    ar: "مرحباً بك في النظام البصري",
    en: "Welcome to the Optical System"
  },
  "description": {
    ar: "نظام إدارة متكامل للعيادات والمستشفيات",
    en: "Integrated management system for clinics and hospitals"
  },
  "current_time": {
    ar: "الوقت الحالي",
    en: "Current Time"
  },
  "reports": {
    ar: "صفحة التقارير",
    en: "Reports Page"
  },
  
  // Remaining Payments
  "remaining_payments": {
    ar: "الدفعات المتبقية",
    en: "Remaining Payments"
  },
  "invoices_with_balance": {
    ar: "الفواتير مع دفعات متبقية",
    en: "Invoices with remaining balance"
  },
  "invoice": {
    ar: "فاتورة",
    en: "Invoice"
  },
  "paid": {
    ar: "مدفوعة",
    en: "Paid"
  },
  "partially_paid": {
    ar: "مدفوعة جزئياً",
    en: "Partially Paid"
  },
  "unpaid": {
    ar: "غير مدفوعة",
    en: "Unpaid"
  },
  "client_name": {
    ar: "اسم العميل",
    en: "Client Name"
  },
  "invoice_total": {
    ar: "إجمالي الفاتورة",
    en: "Invoice Total"
  },
  "paid_amount": {
    ar: "المدفوع",
    en: "Paid Amount"
  },
  "remaining_amount": {
    ar: "المبلغ المتبقي",
    en: "Remaining Amount"
  },
  "add_payment": {
    ar: "إضافة دفعة",
    en: "Add Payment"
  },
  "no_invoices": {
    ar: "لا توجد فواتير بدفعات متبقية",
    en: "No invoices with remaining payments"
  },
  "payment_amount": {
    ar: "مبلغ الدفعة",
    en: "Payment Amount"
  },
  "payment_date": {
    ar: "تاريخ الدفعة",
    en: "Payment Date"
  },
  "cancel": {
    ar: "إلغاء",
    en: "Cancel"
  },
  "confirm": {
    ar: "تأكيد الدفعة",
    en: "Confirm Payment"
  },
  "enter_amount": {
    ar: "الرجاء إدخال مبلغ الدفع",
    en: "Please enter the payment amount"
  },
  "valid_amount": {
    ar: "الرجاء إدخال مبلغ صحيح",
    en: "Please enter a valid amount"
  },
  "exceeds_amount": {
    ar: "مبلغ الدفع يتجاوز المبلغ المتبقي",
    en: "Payment amount exceeds the remaining amount"
  },
  "payment_registered": {
    ar: "تم تسجيل دفعة بقيمة",
    en: "Payment registered for"
  },
  "add_payment_title": {
    ar: "إضافة دفعة",
    en: "Add Payment"
  },
  "remaining_balance": {
    ar: "المبلغ المتبقي",
    en: "Remaining Balance"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("ar");

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "ar" || savedLanguage === "en")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language);
    
    // Set dir attribute on document body
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    
    // Add a class to the document body
    document.body.className = language === "ar" ? "font-cairo rtl" : "ltr";
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    // Return key if translation not found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
