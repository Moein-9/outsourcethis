import { create } from 'zustand';

interface LanguageStore {
  language: 'en' | 'ar';
  setLanguage: (language: 'en' | 'ar') => void;
  t: (key: string) => string;
}

const initialState = {
  language: (localStorage.getItem('language') as 'en' | 'ar') || 'en',
};

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  language: initialState.language,
  setLanguage: (language) => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    set({ language });
  },
  t: (key: string) => {
    const { language } = get();
    const translations: Record<string, Record<string, string>> = {
      dashboard: {
        en: "Dashboard",
        ar: "لوحة التحكم"
      },
      createClient: {
        en: "Create Client",
        ar: "إنشاء عميل"
      },
      createInvoice: {
        en: "Create Invoice",
        ar: "إنشاء فاتورة"
      },
      inventory: {
        en: "Inventory",
        ar: "المخزون"
      },
      reports: {
        en: "Reports",
        ar: "التقارير"
      },
      remainingPayments: {
        en: "Remaining Payments",
        ar: "المدفوعات المتبقية"
      },
      patientSearch: {
        en: "Patient Search",
        ar: "البحث عن مريض"
      },
      refundManager: {
        en: "Refund Manager",
        ar: "إدارة المرتجعات"
      },
      settings: {
        en: "Settings",
        ar: "الإعدادات"
      },
      logout: {
        en: "Logout",
        ar: "تسجيل الخروج"
      },
      invoiceTitle: {
        en: "Create New Invoice",
        ar: "إنشاء فاتورة جديدة"
      },
      clientSection: {
        en: "Client",
        ar: "العميل"
      },
      productSection: {
        en: "Products",
        ar: "المنتجات"
      },
      paymentSection: {
        en: "Payment",
        ar: "الدفع"
      },
      summarySection: {
        en: "Summary",
        ar: "ملخص"
      },
      next: {
        en: "Next",
        ar: "التالي"
      },
      previous: {
        en: "Previous",
        ar: "السابق"
      },
      clientName: {
        en: "Client Name",
        ar: "اسم العميل"
      },
      clientPhone: {
        en: "Client Phone",
        ar: "رقم هاتف العميل"
      },
      lensType: {
        en: "Lens Type",
        ar: "نوع العدسة"
      },
      coating: {
        en: "Coating",
        ar: "طلاء"
      },
      thickness: {
        en: "Thickness",
        ar: "سماكة"
      },
      frameBrand: {
        en: "Frame Brand",
        ar: "ماركة الإطار"
      },
      frameModel: {
        en: "Frame Model",
        ar: "موديل الإطار"
      },
      frameColor: {
        en: "Frame Color",
        ar: "لون الإطار"
      },
      discountSection: {
        en: "Discount",
        ar: "الخصم"
      },
      depositColon: {
        en: "Deposit:",
        ar: "إيداع:"
      },
      payInFull: {
        en: "Pay in Full",
        ar: "ادفع بالكامل"
      },
      cash: {
        en: "Cash",
        ar: "نقداً"
      },
      knet: {
        en: "KNET",
        ar: "كي نت"
      },
      visa: {
        en: "Visa",
        ar: "تأشيرة"
      },
      mastercard: {
        en: "MasterCard",
        ar: "ماستر كارد"
      },
      approvalNumber: {
        en: "Approval Number",
        ar: "رقم الموافقة"
      },
      totalInvoice: {
        en: "Total",
        ar: "المجموع"
      },
      deposit: {
        en: "Deposit",
        ar: "إيداع"
      },
      remaining: {
        en: "Remaining",
        ar: "المتبقي"
      },
      invoiceCreated: {
        en: "Invoice Created!",
        ar: "تم إنشاء الفاتورة!"
      },
      invoiceSuccessMessage: {
        en: "Your invoice has been successfully created.",
        ar: "تم إنشاء فاتورتك بنجاح."
      },
      invoiceNumber: {
        en: "Invoice Number",
        ar: "رقم الفاتورة"
      },
      workOrderNumber: {
        en: "Work Order Number",
        ar: "رقم أمر العمل"
      },
      orderType: {
        en: "Order Type",
        ar: "نوع الطلب"
      },
      clientNameColon: {
        en: "Client Name",
        ar: "اسم العميل"
      },
      date: {
        en: "Date",
        ar: "تاريخ"
      },
      totalInvoiceColon: {
        en: "Total",
        ar: "المجموع"
      },
      paymentStatus: {
        en: "Payment Status",
        ar: "حالة الدفع"
      },
      paidInFull: {
        en: "Paid in Full",
        ar: "مدفوع بالكامل"
      },
      partiallyPaid: {
        en: "Partially Paid",
        ar: "مدفوع جزئيا"
      },
      nextSteps: {
        en: "Next Steps",
        ar: "الخطوات التالية"
      },
      printWorkOrder: {
        en: "Print Work Order",
        ar: "طباعة أمر العمل"
      },
      printWorkOrderDescription: {
        en: "Prepare the work order for the lab.",
        ar: "جهز أمر العمل للمختبر."
      },
      printInvoice: {
        en: "Print Invoice",
        ar: "طباعة الفاتورة"
      },
      printInvoiceDescription: {
        en: "Provide the client with a copy of the invoice.",
        ar: "زود العميل بنسخة من الفاتورة."
      },
      kwd: {
        en: "KWD",
        ar: "د.ك"
      },
      anonymous: {
        en: "Anonymous",
        ar: "مجهول"
      },
      validationError: {
        en: "Validation Error",
        ar: "خطأ في التحقق"
      },
      paymentMethodRequired: {
        en: "Please select a payment method.",
        ar: "الرجاء تحديد طريقة الدفع."
      },
      success: {
        en: "Success",
        ar: "نجاح"
      },
      orderSavedSuccess: {
        en: "Order saved successfully!",
        ar: "تم حفظ الطلب بنجاح!"
      },
      glasses: {
        en: "Glasses",
        ar: "نظارات"
      },
      contactLenses: {
        en: "Contact Lenses",
        ar: "عدسات لاصقة"
      },
      quantity: {
        en: "Quantity",
        ar: "الكمية"
      },
      waitingForClientData: {
        en: "Waiting for client data...",
        ar: "في انتظار بيانات العميل..."
      },
      waitingForProductData: {
        en: "Waiting for product data...",
        ar: "في انتظار بيانات المنتج..."
      },
      waitingForPaymentData: {
        en: "Waiting for payment data...",
        ar: "في انتظار بيانات الدفع..."
      },
      subtotal: {
        en: "Subtotal",
        ar: "المجموع الفرعي"
      },
      discount: {
        en: "Discount",
        ar: "الخصم"
      },
      total: {
        en: "Total",
        ar: "المجموع"
      },
      lensProducts: {
        en: "Lens Products",
        ar: "منتجات العدسات"
      },
      totalLensCost: {
        en: "Total Lens Cost",
        ar: "إجمالي تكلفة العدسات"
      },
      frame: {
        en: "Frame",
        ar: "إطار"
      },
      goToClientSection: {
        en: "Go to Client Section",
        ar: "الذهاب إلى قسم العميل"
      },
      startBySelectingClient: {
        en: "Start by selecting a client to create an invoice.",
        ar: "ابدأ بتحديد عميل لإنشاء فاتورة."
      },
      close: {
        en: "Close",
        ar: "إغلاق"
      },
      print: {
        en: "Print",
        ar: "طباعة"
      }
    };
    
    const lang = language || 'en';
    return translations[key]?.[lang] || key;
  }
}));
