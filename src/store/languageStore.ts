
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ar';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    // Page titles
    dashboard: 'Dashboard',
    invoices: 'Invoices',
    workOrders: 'Work Orders',
    patients: 'Patients',
    settings: 'Settings',
    
    // Common
    search: 'Search',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    print: 'Print',
    close: 'Close',
    next: 'Next',
    previous: 'Previous',
    
    // Dashboard
    quickActions: 'Quick Actions',
    createInvoice: 'Create Invoice',
    addPatient: 'Add Patient',
    recentInvoices: 'Recent Invoices',
    recentWorkOrders: 'Recent Work Orders',
    
    // Invoice
    invoiceTitle: 'Create New Invoice',
    saveInvoice: 'Save Invoice',
    printInvoice: 'Print Invoice',
    printWorkOrder: 'Print Work Order',
    clientSection: 'Patient Information',
    productSection: 'Products Selection',
    paymentSection: 'Payment',
    summarySection: 'Summary',
    
    // Patient section
    patientInformation: 'Patient Information',
    existingPatient: 'Existing Patient',
    newPatient: 'New Patient',
    skipPatient: 'Skip Patient',
    patientName: 'Patient Name',
    patientPhone: 'Phone Number',
    patientRx: 'Prescription',
    rightEye: 'Right Eye (OD)',
    leftEye: 'Left Eye (OS)',
    
    // RX
    sphere: 'Sphere',
    cylinder: 'Cylinder',
    axis: 'Axis',
    add: 'Add',
    pd: 'PD',
    
    // Products section
    chooseProducts: 'Choose Products',
    glasses: 'Glasses',
    contacts: 'Contact Lenses',
    selectLensType: 'Select Lens Type',
    lensPrice: 'Lens Price',
    lensCoating: 'Lens Coating',
    coatingPrice: 'Coating Price',
    frameDetails: 'Frame Details',
    skipFrame: 'Skip Frame',
    frameBrand: 'Frame Brand',
    frameModel: 'Frame Model',
    frameColor: 'Frame Color',
    frameSize: 'Frame Size',
    framePrice: 'Frame Price',
    
    // Contact lenses
    contactLensDetails: 'Contact Lens Details',
    addContactLens: 'Add Contact Lens',
    contactLensBrand: 'Brand',
    contactLensType: 'Type',
    contactLensPower: 'Power',
    contactLensQuantity: 'Quantity',
    contactLensPrice: 'Price',
    
    // Payment section
    discountSection: 'Discount & Deposit',
    discountColon: 'Discount:',
    depositColon: 'Deposit:',
    payInFull: 'Pay in Full',
    totalInvoice: 'Total Invoice',
    deposit: 'Deposit',
    remaining: 'Remaining',
    createWorkOrder: 'Create Work Order',
    workOrderCreated: 'Work Order Created',
    approvalNumber: 'Authorization Number',
    
    // Payment methods
    cash: 'Cash',
    knet: 'KNET',
    visa: 'Visa',
    mastercard: 'MasterCard',
    
    // Summary section
    invoiceCreated: 'Invoice Created Successfully',
    orderCreated: 'Order Created Successfully',
    invoiceSuccessMessage: 'Your invoice has been created successfully.',
    orderSuccessMessage: 'Your order has been created successfully.',
    startBySelectingClient: 'Please start by selecting a patient and creating an invoice.',
    goToClientSection: 'Go to Patient Section',
    clientName: 'Patient Name',
    invoiceNumber: 'Invoice Number',
    workOrderNumber: 'Work Order Number',
    phoneNumber: 'Phone Number',
    date: 'Date',
    totalAmount: 'Total Amount',
    paymentStatus: 'Payment Status',
    paid: 'Paid',
    partiallyPaid: 'Partially Paid',
    nextSteps: 'Next Steps',
    printWorkOrderDescription: 'Print the work order for the lab.',
    printInvoiceDescription: 'Print the invoice for the customer.',
    
    // Invoice list
    viewInvoice: 'View Invoice',
    payRemaining: 'Pay Remaining',
    
    // Misc
    frame: 'Frame',
    lensType: 'Lens Type',
    coating: 'Coating',
    total: 'Total',
    subtotal: 'Subtotal',
    discount: 'Discount',
    kwd: 'KWD',
    paidInFull: 'Paid in Full',
    waitingForClientData: 'Waiting for patient data',
    waitingForProductData: 'Waiting for product selection',
    waitingForPaymentData: 'Waiting for payment details',
    viewDetails: 'View Details',
    success: 'Success',
    error: 'Error',
    paymentMethodError: 'Please select a payment method.',
    invoiceSavedSuccess: 'Invoice saved successfully.',
    orderSavedSuccess: 'Order saved successfully.',
    
    // Print related
    invoice: 'Invoice',
    workOrder: 'Work Order',
    name: 'Name',
    phone: 'Phone',
    patientId: 'Patient ID',
    brand: 'Brand',
    model: 'Model',
    color: 'Color',
    size: 'Size',
    prescriptionDetails: 'Prescription Details',
    eye: 'Eye',
    contactLensPrescription: 'Contact Lens Prescription',
    lensInformation: 'Lens Information',
    lens: 'Lens',
    power: 'Power',
    anonymous: 'Anonymous',
  },
  ar: {
    // Page titles
    dashboard: 'لوحة التحكم',
    invoices: 'الفواتير',
    workOrders: 'طلبات العمل',
    patients: 'المرضى',
    settings: 'الإعدادات',
    
    // Common
    search: 'بحث',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    view: 'عرض',
    print: 'طباعة',
    close: 'إغلاق',
    next: 'التالي',
    previous: 'السابق',
    
    // Dashboard
    quickActions: 'إجراءات سريعة',
    createInvoice: 'إنشاء فاتورة',
    addPatient: 'إضافة مريض',
    recentInvoices: 'الفواتير الأخيرة',
    recentWorkOrders: 'طلبات العمل الأخيرة',
    
    // Invoice
    invoiceTitle: 'إنشاء فاتورة جديدة',
    saveInvoice: 'حفظ الفاتورة',
    printInvoice: 'طباعة الفاتورة',
    printWorkOrder: 'طباعة طلب العمل',
    clientSection: 'معلومات المريض',
    productSection: 'اختيار المنتجات',
    paymentSection: 'الدفع',
    summarySection: 'الملخص',
    
    // Patient section
    patientInformation: 'معلومات المريض',
    existingPatient: 'مريض موجود',
    newPatient: 'مريض جديد',
    skipPatient: 'تخطي المريض',
    patientName: 'اسم المريض',
    patientPhone: 'رقم الهاتف',
    patientRx: 'الوصفة الطبية',
    rightEye: 'العين اليمنى (OD)',
    leftEye: 'العين اليسرى (OS)',
    
    // RX
    sphere: 'كروي',
    cylinder: 'أسطواني',
    axis: 'محور',
    add: 'إضافة',
    pd: 'المسافة البؤبؤية',
    
    // Products section
    chooseProducts: 'اختر المنتجات',
    glasses: 'نظارات',
    contacts: 'عدسات لاصقة',
    selectLensType: 'نوع العدسة',
    lensPrice: 'سعر العدسة',
    lensCoating: 'طلاء العدسة',
    coatingPrice: 'سعر الطلاء',
    frameDetails: 'تفاصيل الإطار',
    skipFrame: 'تخطي الإطار',
    frameBrand: 'ماركة الإطار',
    frameModel: 'موديل الإطار',
    frameColor: 'لون الإطار',
    frameSize: 'مقاس الإطار',
    framePrice: 'سعر الإطار',
    
    // Contact lenses
    contactLensDetails: 'تفاصيل العدسات اللاصقة',
    addContactLens: 'إضافة عدسة لاصقة',
    contactLensBrand: 'الماركة',
    contactLensType: 'النوع',
    contactLensPower: 'القوة',
    contactLensQuantity: 'الكمية',
    contactLensPrice: 'السعر',
    
    // Payment section
    discountSection: 'الخصم والعربون',
    discountColon: 'الخصم:',
    depositColon: 'العربون:',
    payInFull: 'دفع كامل',
    totalInvoice: 'إجمالي الفاتورة',
    deposit: 'العربون',
    remaining: 'المتبقي',
    createWorkOrder: 'إنشاء طلب عمل',
    workOrderCreated: 'تم إنشاء طلب العمل',
    approvalNumber: 'رقم التفويض',
    
    // Payment methods
    cash: 'نقداً',
    knet: 'كي نت',
    visa: 'فيزا',
    mastercard: 'ماستركارد',
    
    // Summary section
    invoiceCreated: 'تم إنشاء الفاتورة بنجاح',
    orderCreated: 'تم إنشاء الطلب بنجاح',
    invoiceSuccessMessage: 'تم إنشاء الفاتورة بنجاح.',
    orderSuccessMessage: 'تم إنشاء الطلب بنجاح.',
    startBySelectingClient: 'الرجاء البدء باختيار مريض وإنشاء فاتورة.',
    goToClientSection: 'الذهاب إلى قسم المريض',
    clientName: 'اسم المريض',
    invoiceNumber: 'رقم الفاتورة',
    workOrderNumber: 'رقم طلب العمل',
    phoneNumber: 'رقم الهاتف',
    date: 'التاريخ',
    totalAmount: 'المبلغ الإجمالي',
    paymentStatus: 'حالة الدفع',
    paid: 'مدفوع',
    partiallyPaid: 'مدفوع جزئياً',
    nextSteps: 'الخطوات التالية',
    printWorkOrderDescription: 'طباعة طلب العمل للمختبر.',
    printInvoiceDescription: 'طباعة الفاتورة للعميل.',
    
    // Invoice list
    viewInvoice: 'عرض الفاتورة',
    payRemaining: 'دفع المبلغ المتبقي',
    
    // Misc
    frame: 'الإطار',
    lensType: 'نوع العدسة',
    coating: 'الطلاء',
    total: 'الإجمالي',
    subtotal: 'المجموع الفرعي',
    discount: 'الخصم',
    kwd: 'د.ك',
    paidInFull: 'مدفوع بالكامل',
    waitingForClientData: 'بانتظار بيانات المريض',
    waitingForProductData: 'بانتظار اختيار المنتجات',
    waitingForPaymentData: 'بانتظار تفاصيل الدفع',
    viewDetails: 'عرض التفاصيل',
    success: 'نجاح',
    error: 'خطأ',
    paymentMethodError: 'الرجاء اختيار طريقة الدفع.',
    invoiceSavedSuccess: 'تم حفظ الفاتورة بنجاح.',
    orderSavedSuccess: 'تم حفظ الطلب بنجاح.',
    
    // Print related
    invoice: 'فاتورة',
    workOrder: 'طلب عمل',
    name: 'الاسم',
    phone: 'الهاتف',
    patientId: 'رقم المريض',
    brand: 'الماركة',
    model: 'الموديل',
    color: 'اللون',
    size: 'المقاس',
    prescriptionDetails: 'تفاصيل الوصفة الطبية',
    eye: 'العين',
    contactLensPrescription: 'وصفة العدسات اللاصقة',
    lensInformation: 'معلومات العدسات',
    lens: 'عدسة',
    power: 'القوة',
    anonymous: 'مجهول',
  }
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      
      setLanguage: (language) => {
        set({ language });
      },
      
      t: (key) => {
        const { language } = get();
        return translations[language]?.[key] || key;
      }
    }),
    {
      name: 'language-store',
    }
  )
);
