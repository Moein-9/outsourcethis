import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'en' | 'ar';
  t: (key: keyof Translations) => string;
  toggleLanguage: () => void;
}

interface Translations {
  invoice: string;
  patient: string;
  date: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: string;
  paid: string;
  unpaid: string;
  invoiceId: string;
  customerName: string;
  customerPhone: string;
  amountPaid: string;
  remainingAmount: string;
  makePayment: string;
  selectPaymentMethod: string;
  cash: string;
  knet: string;
  creditCard: string;
  paymentSuccessful: string;
  paymentFailed: string;
  printReceipt: string;
  enterAmount: string;
  enterAuthNumber: string;
  authNumber: string;
  depositReceived: string;
  addPayment: string;
  editInvoice: string;
  saveChanges: string;
  cancel: string;
  invoiceDetails: string;
  workOrderDetails: string;
  additionalNotes: string;
  contactLens: string;
  lensType: string;
  lensPrice: string;
  frame: string;
  frameBrand: string;
  frameModel: string;
  frameColor: string;
  frameSize: string;
  framePrice: string;
  coating: string;
  coatingPrice: string;
  discount: string;
  total: string;
  deposit: string;
  remaining: string;
  payment: string;
  createdAt: string;
  isPaid: string;
  isPickedUp: string;
  pickedUpAt: string;
  lastEditedAt: string;
  editHistory: string;
  timestamp: string;
  notes: string;
  glasses: string;
  contacts: string;
  search: string;
  noResults: string;
  select: string;
  refundAmount: string;
  refundMethod: string;
  refundReason: string;
  additionalNotesForRefund: string;
  processRefund: string;
  refundProcessedSuccessfully: string;
  errorProcessingRefund: string;
  missingData: string;
  selectRefundMethod: string;
  enterRefundReason: string;
  refund: string;
  refundReceipt: string;
  thankYou: string;
  refundId: string;
  invoiceIdLabel: string;
  customerLabel: string;
  dateLabel: string;
  amountRefunded: string;
  refundMethodLabel: string;
  reasonLabel: string;
  refundProcessed: string;
  receiptSentToPrinter: string;
  processingPrintRequest: string;
  refundInformation: string;
  totalInvoiceAmount: string;
  selectReason: string;
  customerDissatisfied: string;
  productDefect: string;
  incorrectPrescription: string;
  frameExchange: string;
  billingError: string;
  other: string;
  staffNotes: string;
  archive: string;
  deleteOrder: string;
  reasonForDeletion: string;
  confirmDeletion: string;
  orderDeletedSuccessfully: string;
  orderDeletionFailed: string;
  workOrder: string;
  workOrders: string;
  active: string;
  completed: string;
  transactionHistory: string;
  transactions: string;
  noActiveOrders: string;
  noCompletedOrders: string;
  noRefundedTransactions: string;
  noArchivedOrders: string;
  printInvoice: string;
  printWorkOrder: string;
  markAsPickedUp: string;
  orderPickedUpSuccessfully: string;
  anonymous: string;
  areYouSure: string;
  thisActionCannotBeUndone: string;
  delete: string;
  deleted: string;
  archived: string;
  refunded: string;
  refundInfo: string;
  amount: string;
}

const translations: { [key: string]: Translations } = {
  en: {
    invoice: 'Invoice',
    patient: 'Patient',
    date: 'Date',
    totalAmount: 'Total Amount',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    paid: 'Paid',
    unpaid: 'Unpaid',
    invoiceId: 'Invoice ID',
    customerName: 'Customer Name',
    customerPhone: 'Customer Phone',
    amountPaid: 'Amount Paid',
    remainingAmount: 'Remaining Amount',
    makePayment: 'Make Payment',
    selectPaymentMethod: 'Select Payment Method',
    cash: 'Cash',
    knet: 'KNET',
    creditCard: 'Credit Card',
    paymentSuccessful: 'Payment Successful',
    paymentFailed: 'Payment Failed',
    printReceipt: 'Print Receipt',
    enterAmount: 'Enter Amount',
    enterAuthNumber: 'Enter Auth Number',
    authNumber: 'Auth Number',
    depositReceived: 'Deposit Received',
    addPayment: 'Add Payment',
    editInvoice: 'Edit Invoice',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    invoiceDetails: 'Invoice Details',
    workOrderDetails: 'Work Order Details',
    additionalNotes: 'Additional Notes',
    contactLens: 'Contact Lens',
    lensType: 'Lens Type',
    lensPrice: 'Lens Price',
    frame: 'Frame',
    frameBrand: 'Frame Brand',
    frameModel: 'Frame Model',
    frameColor: 'Frame Color',
    frameSize: 'Frame Size',
    framePrice: 'Frame Price',
    coating: 'Coating',
    coatingPrice: 'Coating Price',
    discount: 'Discount',
    total: 'Total',
    deposit: 'Deposit',
    remaining: 'Remaining',
    payment: 'Payment',
    createdAt: 'Created At',
    isPaid: 'Is Paid',
    isPickedUp: 'Is Picked Up',
    pickedUpAt: 'Picked Up At',
    lastEditedAt: 'Last Edited At',
    editHistory: 'Edit History',
    timestamp: 'Timestamp',
    notes: 'Notes',
    glasses: 'Glasses',
    contacts: 'Contacts',
    search: 'Search',
    noResults: 'No Results',
    select: 'Select',
    refundAmount: 'Refund Amount',
    refundMethod: 'Refund Method',
    refundReason: 'Refund Reason',
    additionalNotesForRefund: 'Additional Notes for Refund',
    processRefund: 'Process Refund',
    refundProcessedSuccessfully: 'Refund Processed Successfully',
    errorProcessingRefund: 'Error Processing Refund',
    missingData: 'Missing Data',
    selectRefundMethod: 'Select Refund Method',
    enterRefundReason: 'Enter Refund Reason',
    refund: 'Refund',
    refundReceipt: 'Refund Receipt',
    thankYou: 'Thank you for your business',
    refundId: 'Refund ID',
    invoiceIdLabel: 'Invoice ID:',
    customerLabel: 'Customer:',
    dateLabel: 'Date:',
    amountRefunded: 'Amount Refunded:',
    refundMethodLabel: 'Refund Method:',
    reasonLabel: 'Reason:',
    refundProcessed: 'Refund Processed',
    receiptSentToPrinter: 'Receipt sent to printer',
    processingPrintRequest: 'Processing print request',
    refundInformation: 'Refund Information',
    totalInvoiceAmount: 'Total Invoice Amount',
    selectReason: 'Select Reason',
    customerDissatisfied: 'Customer Dissatisfied',
    productDefect: 'Product Defect',
    incorrectPrescription: 'Incorrect Prescription',
    frameExchange: 'Frame Exchange',
    billingError: 'Billing Error',
    other: 'Other',
    staffNotes: 'Staff Notes',
    archive: 'Archive',
    deleteOrder: 'Delete Order',
    reasonForDeletion: 'Reason for Deletion',
    confirmDeletion: 'Confirm Deletion',
    orderDeletedSuccessfully: 'Order Deleted Successfully',
    orderDeletionFailed: 'Order Deletion Failed',
    workOrder: 'Work Order',
    workOrders: 'Work Orders',
    active: 'Active',
    completed: 'Completed',
    transactionHistory: 'Transaction History',
    transactions: 'Transactions',
    noActiveOrders: 'No active orders',
    noCompletedOrders: 'No completed orders',
    noRefundedTransactions: 'No refunded transactions',
    noArchivedOrders: 'No archived orders',
    printInvoice: 'Print Invoice',
    printWorkOrder: 'Print Work Order',
    markAsPickedUp: 'Mark as Picked Up',
    orderPickedUpSuccessfully: 'Order has been marked as picked up',
    anonymous: 'Anonymous',
    areYouSure: 'Are you sure?',
    thisActionCannotBeUndone: 'This action cannot be undone.',
    delete: 'Delete',
    deleted: 'Deleted',
    archived: 'Archived',
    refunded: 'Refunded',
    refundInfo: 'Refund Info',
    amount: 'Amount',
  },
  ar: {
    invoice: 'فاتورة',
    patient: 'مريض',
    date: 'تاريخ',
    totalAmount: 'المبلغ الإجمالي',
    paymentMethod: 'طريقة الدفع',
    paymentStatus: 'حالة الدفع',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    invoiceId: 'رقم الفاتورة',
    customerName: 'اسم العميل',
    customerPhone: 'رقم هاتف العميل',
    amountPaid: 'المبلغ المدفوع',
    remainingAmount: 'المبلغ المتبقي',
    makePayment: 'إجراء الدفع',
    selectPaymentMethod: 'اختر طريقة الدفع',
    cash: 'نقداً',
    knet: 'كي نت',
    creditCard: 'بطاقة ائتمان',
    paymentSuccessful: 'تم الدفع بنجاح',
    paymentFailed: 'فشل الدفع',
    printReceipt: 'طباعة الإيصال',
    enterAmount: 'أدخل المبلغ',
    enterAuthNumber: 'أدخل رقم التفويض',
    authNumber: 'رقم التفويض',
    depositReceived: 'تم استلام الإيداع',
    addPayment: 'إضافة دفعة',
    editInvoice: 'تعديل الفاتورة',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    invoiceDetails: 'تفاصيل الفاتورة',
    workOrderDetails: 'تفاصيل أمر العمل',
    additionalNotes: 'ملاحظات إضافية',
    contactLens: 'عدسة لاصقة',
    lensType: 'نوع العدسة',
    lensPrice: 'سعر العدسة',
    frame: 'إطار',
    frameBrand: 'ماركة الإطار',
    frameModel: 'موديل الإطار',
    frameColor: 'لون الإطار',
    frameSize: 'حجم الإطار',
    framePrice: 'سعر الإطار',
    coating: 'طلاء',
    coatingPrice: 'سعر الطلاء',
    discount: 'خصم',
    total: 'المجموع',
    deposit: 'إيداع',
    remaining: 'المتبقي',
    payment: 'دفع',
    createdAt: 'أنشئت في',
    isPaid: 'تم الدفع',
    isPickedUp: 'تم الاستلام',
    pickedUpAt: 'تم الاستلام في',
    lastEditedAt: 'آخر تعديل في',
    editHistory: 'سجل التعديلات',
    timestamp: 'الطابع الزمني',
    notes: 'ملاحظات',
    glasses: 'نظارات',
    contacts: 'عدسات',
    search: 'بحث',
    noResults: 'لا يوجد نتائج',
    select: 'اختر',
    refundAmount: 'مبلغ الاسترداد',
    refundMethod: 'طريقة الاسترداد',
    refundReason: 'سبب الاسترداد',
    additionalNotesForRefund: 'ملاحظات إضافية للاسترداد',
    processRefund: 'معالجة الاسترداد',
    refundProcessedSuccessfully: 'تمت معالجة الاسترداد بنجاح',
    errorProcessingRefund: 'خطأ في معالجة الاسترداد',
    missingData: 'بيانات مفقودة',
    selectRefundMethod: 'اختر طريقة الاسترداد',
    enterRefundReason: 'أدخل سبب الاسترداد',
    refund: 'استرداد',
    refundReceipt: 'إيصال استرداد',
    thankYou: 'شكراً لتعاملكم معنا',
    refundId: 'رقم الاسترداد',
    invoiceIdLabel: 'رقم الفاتورة:',
    customerLabel: 'العميل:',
    dateLabel: 'التاريخ:',
    amountRefunded: 'المبلغ المسترد:',
    refundMethodLabel: 'طريقة الاسترداد:',
    reasonLabel: 'السبب:',
    refundProcessed: 'تم استرداد المبلغ',
    receiptSentToPrinter: 'تم إرسال الإيصال إلى الطابعة',
    processingPrintRequest: 'جاري معالجة طلب الطباعة',
    refundInformation: 'معلومات الاسترداد',
    totalInvoiceAmount: 'إجمالي مبلغ الفاتورة',
    selectReason: 'اختر السبب',
    customerDissatisfied: 'العميل غير راضٍ',
    productDefect: 'عيب في المنتج',
    incorrectPrescription: 'وصفة طبية غير صحيحة',
    frameExchange: 'استبدال الإطار',
    billingError: 'خطأ في الفواتير',
    other: 'آخر',
    staffNotes: 'ملاحظات الموظفين',
    archive: 'أرشيف',
    deleteOrder: 'حذف الطلب',
    reasonForDeletion: 'سبب الحذف',
    confirmDeletion: 'تأكيد الحذف',
    orderDeletedSuccessfully: 'تم حذف الطلب بنجاح',
    orderDeletionFailed: 'فشل حذف الطلب',
    workOrder: 'أمر عمل',
    workOrders: 'أوامر العمل',
    active: 'نشط',
    completed: 'مكتمل',
    transactionHistory: 'سجل المعاملات',
    transactions: 'المعاملات',
    noActiveOrders: 'لا توجد طلبات نشطة',
    noCompletedOrders: 'لا توجد طلبات مكتملة',
    noRefundedTransactions: 'لا توجد مبالغ مستردة',
    noArchivedOrders: 'لا توجد طلبات مؤرشفة',
    printInvoice: 'طباعة الفاتورة',
    printWorkOrder: 'طباعة أمر العمل',
    markAsPickedUp: 'تأكيد الاستلام',
    orderPickedUpSuccessfully: 'تم تأكيد استلام الطلب بنجاح',
    anonymous: 'مجهول',
    areYouSure: 'هل أنت متأكد؟',
    thisActionCannotBeUndone: 'لا يمكن التراجع عن هذا الإجراء.',
    delete: 'حذف',
    deleted: 'تم الحذف',
    archived: 'مؤرشف',
    refunded: 'مسترد',
    refundInfo: 'معلومات الاسترداد',
    amount: 'المبلغ',
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: (localStorage.getItem('language') as 'en' | 'ar') || 'en',
      t: (key) => translations[get().language][key] || key,
      toggleLanguage: () => {
        set((state) => {
          const newLanguage = state.language === 'en' ? 'ar' : 'en';
          localStorage.setItem('language', newLanguage);
          return { language: newLanguage };
        });
      },
    }),
    {
      name: 'language-storage',
      storage: {
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          localStorage.setItem(name, value);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
