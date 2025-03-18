
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  language: 'ar' | 'en';
  setLanguage: (language: 'ar' | 'en') => void;
  t: (key: string) => string;
}

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  // Navigation
  "dashboard": {
    ar: "الرئيسية", 
    en: "Dashboard"
  },
  "createClient": {
    ar: "إنشاء عميل", 
    en: "New Client"
  },
  "createInvoice": {
    ar: "إنشاء فاتورة", 
    en: "New Invoice"
  },
  "inventory": {
    ar: "إدارة المخزون", 
    en: "Inventory"
  },
  "remainingPayments": {
    ar: "المتبقي", 
    en: "Payments Due"
  },
  "patientSearch": {
    ar: "بحث عن عميل", 
    en: "Client Search"
  },
  // Dashboard
  "welcome": {
    ar: "مرحباً بك في نظام معين للبصريات",
    en: "Welcome to Moen Optical System"
  },
  "systemDescription": {
    ar: "نظام إدارة متكامل للعيادات والمستشفيات",
    en: "Integrated management system for clinics and hospitals"
  },
  "reportsPage": {
    ar: "صفحة التقارير",
    en: "Reports Page"
  },
  "currentTime": {
    ar: "الوقت الحالي",
    en: "Current Time"
  },
  // Inventory tabs
  "frames": {
    ar: "الإطارات",
    en: "Frames"
  },
  "contactLenses": {
    ar: "العدسات اللاصقة",
    en: "Contact Lenses"
  },
  "lensTypes": {
    ar: "أنواع العدسات",
    en: "Lens Types"
  },
  "lensCoatings": {
    ar: "طلاءات العدسات",
    en: "Lens Coatings"
  },
  "frameManagement": {
    ar: "إدارة الإطارات",
    en: "Frames Management"
  },
  "contactLensManagement": {
    ar: "إدارة العدسات اللاصقة",
    en: "Contact Lens Management"
  },
  // Client creation
  "createClientTitle": {
    ar: "إنشاء عميل",
    en: "Create Client"
  },
  "prescriptionGlasses": {
    ar: "نظارات طبية",
    en: "Prescription Glasses"
  },
  "contactLensesTab": {
    ar: "عدسات لاصقة",
    en: "Contact Lenses"
  },
  "personalInfo": {
    ar: "المعلومات الشخصية",
    en: "Personal Information"
  },
  "name": {
    ar: "الاسم",
    en: "Name"
  },
  "fullName": {
    ar: "الاسم الكامل",
    en: "Full Name"
  },
  "phone": {
    ar: "الهاتف",
    en: "Phone"
  },
  "phoneNumber": {
    ar: "رقم الهاتف",
    en: "Phone Number"
  },
  "dateOfBirth": {
    ar: "تاريخ الميلاد",
    en: "Date of Birth"
  },
  "day": {
    ar: "اليوم",
    en: "Day"
  },
  "month": {
    ar: "الشهر",
    en: "Month"
  },
  "year": {
    ar: "السنة",
    en: "Year"
  },
  "clientDidntShareDOB": {
    ar: "لم يشارك العميل بتاريخ الميلاد",
    en: "Client did not share birth date"
  },
  "notes": {
    ar: "ملاحظات",
    en: "Notes"
  },
  "clientNotesPreferences": {
    ar: "ملاحظات أو تفضيلات العميل",
    en: "Client notes or preferences"
  },
  // Prescription
  "glassesPrescription": {
    ar: "وصفات النظارات",
    en: "Glasses Prescription"
  },
  "prescriptionDate": {
    ar: "تاريخ الوصفة الطبية",
    en: "Prescription Date"
  },
  "choosePrescriptionDate": {
    ar: "اختر تاريخ الوصفة",
    en: "Choose prescription date"
  },
  "right": {
    ar: "يمين",
    en: "Right"
  },
  "left": {
    ar: "يسار",
    en: "Left"
  },
  "saveAndContinue": {
    ar: "حفظ ومتابعة",
    en: "Save & Continue"
  },
  // Remaining Payments
  "remainingPaymentsTitle": {
    ar: "المتبقي للدفع",
    en: "Payments Due"
  },
  "remainingPaymentsDescription": {
    ar: "إدارة الفواتير غير المكتملة وتسجيل الدفعات المتبقية",
    en: "Manage incomplete invoices and record remaining payments"
  },
  "searchClientOrInvoice": {
    ar: "البحث عن عميل أو رقم فاتورة...",
    en: "Search for client or invoice number..."
  },
  "sortBy": {
    ar: "ترتيب حسب",
    en: "Sort by"
  },
  "newestFirst": {
    ar: "الأحدث أولاً",
    en: "Newest first"
  },
  "oldestFirst": {
    ar: "الأقدم أولاً",
    en: "Oldest first"
  },
  "allInvoicesPaid": {
    ar: "جميع الفواتير مدفوعة بالكامل",
    en: "All invoices are fully paid"
  },
  "noRemainingPayments": {
    ar: "لا توجد فواتير تحتاج إلى دفعات متبقية. جميع المعاملات مكتملة.",
    en: "No invoices need remaining payments. All transactions are complete."
  },
  "remaining": {
    ar: "متبقي",
    en: "Remaining"
  },
  "glassesDetails": {
    ar: "تفاصيل النظارة",
    en: "Glasses Details"
  },
  "lensType": {
    ar: "نوع العدسة",
    en: "Lens Type"
  },
  "frame": {
    ar: "الإطار",
    en: "Frame"
  },
  "coating": {
    ar: "الطلاء",
    en: "Coating"
  },
  "totalPrice": {
    ar: "السعر الإجمالي",
    en: "Total Price"
  },
  "invoiceTotal": {
    ar: "إجمالي الفاتورة",
    en: "Invoice Total"
  },
  "paid": {
    ar: "المدفوع",
    en: "Paid"
  },
  "paymentHistory": {
    ar: "سجل الدفعات",
    en: "Payment History"
  },
  "viewInvoice": {
    ar: "عرض الفاتورة",
    en: "View Invoice"
  },
  "clientProfile": {
    ar: "ملف العميل",
    en: "Client Profile"
  },
  "makePayment": {
    ar: "تسديد الدفعة",
    en: "Make Payment"
  },
  "newPayment": {
    ar: "تسجيل دفعة جديدة",
    en: "Record New Payment"
  },
  "paymentDetails": {
    ar: "تسجيل دفعة للفاتورة",
    en: "Payment for invoice"
  },
  "totalAmount": {
    ar: "المبلغ الإجمالي",
    en: "Total Amount"
  },
  "previouslyPaid": {
    ar: "المدفوع سابقاً",
    en: "Previously Paid"
  },
  "remainingAmount": {
    ar: "المبلغ المتبقي",
    en: "Remaining Amount"
  },
  "remainingAfterPayment": {
    ar: "المتبقي بعد الدفع",
    en: "Remaining After Payment"
  },
  "paymentMethods": {
    ar: "طرق الدفع",
    en: "Payment Methods"
  },
  "addPaymentMethod": {
    ar: "إضافة طريقة دفع",
    en: "Add Payment Method"
  },
  "paymentMethod": {
    ar: "طريقة الدفع",
    en: "Payment Method"
  },
  "choosePaymentMethod": {
    ar: "اختر طريقة الدفع",
    en: "Choose payment method"
  },
  "cash": {
    ar: "نقداً",
    en: "Cash"
  },
  "knet": {
    ar: "كي نت",
    en: "K-NET"
  },
  "amount": {
    ar: "المبلغ",
    en: "Amount"
  },
  "authNumber": {
    ar: "رقم التفويض",
    en: "Authorization Number"
  },
  "totalPaid": {
    ar: "إجمالي المدفوع",
    en: "Total Paid"
  },
  "cancel": {
    ar: "إلغاء",
    en: "Cancel"
  },
  "confirmPayment": {
    ar: "تأكيد الدفع",
    en: "Confirm Payment"
  },
  "paymentSuccessful": {
    ar: "تم تسجيل الدفع بنجاح",
    en: "Payment Recorded Successfully"
  },
  "paymentSuccessMessage": {
    ar: "تم إكمال الدفع بنجاح! هل ترغب في طباعة الفاتورة النهائية؟",
    en: "Payment completed successfully! Would you like to print the final invoice?"
  },
  "close": {
    ar: "إغلاق",
    en: "Close"
  },
  "printInvoice": {
    ar: "طباعة الفاتورة",
    en: "Print Invoice"
  },
  "error": {
    ar: "خطأ",
    en: "Error"
  },
  "success": {
    ar: "تم الحفظ",
    en: "Saved"
  },
  "successMessage": {
    ar: "تم حفظ البيانات بنجاح.",
    en: "Data saved successfully."
  },
  "requiredField": {
    ar: "حقل مطلوب.",
    en: "This field is required."
  },
  // Months
  "january": {
    ar: "يناير",
    en: "January"
  },
  "february": {
    ar: "فبراير",
    en: "February"
  },
  "march": {
    ar: "مارس",
    en: "March"
  },
  "april": {
    ar: "أبريل",
    en: "April"
  },
  "may": {
    ar: "مايو",
    en: "May"
  },
  "june": {
    ar: "يونيو",
    en: "June"
  },
  "july": {
    ar: "يوليو",
    en: "July"
  },
  "august": {
    ar: "أغسطس",
    en: "August"
  },
  "september": {
    ar: "سبتمبر",
    en: "September"
  },
  "october": {
    ar: "أكتوبر",
    en: "October"
  },
  "november": {
    ar: "نوفمبر",
    en: "November"
  },
  "december": {
    ar: "ديسمبر",
    en: "December"
  },
  // Receipt and invoice translations
  "invoice": {
    ar: "فاتورة",
    en: "Invoice"
  },
  "invoiceNumber": {
    ar: "رقم الفاتورة",
    en: "Invoice Number"
  },
  "date": {
    ar: "التاريخ",
    en: "Date"
  },
  "client": {
    ar: "العميل",
    en: "Client"
  },
  "products": {
    ar: "المنتجات",
    en: "Products"
  },
  "subtotal": {
    ar: "المجموع الفرعي",
    en: "Subtotal"
  },
  "discount": {
    ar: "الخصم",
    en: "Discount"
  },
  "total": {
    ar: "الإجمالي",
    en: "Total"
  },
  "payments": {
    ar: "المدفوعات",
    en: "Payments"
  },
  "remainingBalance": {
    ar: "المبلغ المتبقي",
    en: "Remaining Balance"
  },
  "fullyPaid": {
    ar: "تم الدفع بالكامل",
    en: "Fully Paid"
  },
  "thankYou": {
    ar: "شكراً لتعاملكم معنا!",
    en: "Thank you for your business!"
  },
  "pleaseKeepReceipt": {
    ar: "يرجى الاحتفاظ بهذه الفاتورة للرجوع إليها",
    en: "Please keep this receipt for your records"
  },
  // Language toggle
  "language": {
    ar: "English",
    en: "العربية"
  },
  "languageCode": {
    ar: "EN",
    en: "AR"
  },
  // Frame inventory translations
  "search": {
    ar: "بحث",
    en: "Search"
  },
  "searchForFrame": {
    ar: "البحث عن إطار (ماركة، موديل، لون...)",
    en: "Search for frame (brand, model, color...)"
  },
  "printLabels": {
    ar: "طباعة البطاقات",
    en: "Print Labels"
  },
  "addNewFrame": {
    ar: "إضافة إطار جديد",
    en: "Add New Frame"
  },
  "addNewFrameTitle": {
    ar: "إضافة إطار جديد",
    en: "Add New Frame"
  },
  "addNewFrameDescription": {
    ar: "أدخل تفاصيل الإطار الجديد لإضافته إلى المخزون",
    en: "Enter new frame details to add to inventory"
  },
  "brand": {
    ar: "الماركة",
    en: "Brand"
  },
  "model": {
    ar: "الموديل",
    en: "Model"
  },
  "color": {
    ar: "اللون",
    en: "Color"
  },
  "size": {
    ar: "المقاس",
    en: "Size"
  },
  "price": {
    ar: "السعر",
    en: "Price"
  },
  "quantity": {
    ar: "الكمية",
    en: "Quantity"
  },
  "inStock": {
    ar: "في المخزون",
    en: "In Stock"
  },
  "edit": {
    ar: "تعديل",
    en: "Edit"
  },
  "copy": {
    ar: "نسخ",
    en: "Copy"
  },
  "print": {
    ar: "طباعة",
    en: "Print"
  },
  "save": {
    ar: "حفظ",
    en: "Save"
  },
  "saveFrame": {
    ar: "حفظ الإطار",
    en: "Save Frame"
  },
  "noFramesFound": {
    ar: "لا توجد إطارات",
    en: "No Frames Found"
  },
  "noFramesMatchingSearch": {
    ar: "لم يتم العثور على إطارات مطابقة للبحث.",
    en: "No frames match your search criteria."
  },
  "showAllFrames": {
    ar: "عرض جميع الإطارات",
    en: "Show All Frames"
  },
  "printFrameLabels": {
    ar: "طباعة بطاقات الإطارات",
    en: "Print Frame Labels"
  },
  "selectFramesForLabels": {
    ar: "حدد الإطارات التي تريد طباعة بطاقات لها",
    en: "Select frames to print labels for"
  },
  "brandExample": {
    ar: "مثال: RayBan",
    en: "Example: RayBan"
  },
  "modelExample": {
    ar: "مثال: RB3025",
    en: "Example: RB3025"
  },
  "colorExample": {
    ar: "مثال: أسود",
    en: "Example: Black"
  },
  "sizeExample": {
    ar: "مثال: 52-18-145",
    en: "Example: 52-18-145"
  }
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'ar',
      setLanguage: (language) => set({ language }),
      t: (key) => {
        const lang = get().language;
        // If translation exists, return it, otherwise return the key
        return translations[key]?.[lang] || key;
      }
    }),
    {
      name: 'language-store'
    }
  )
);
