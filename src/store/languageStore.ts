
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
  },
  // New Client and Prescription additional translations
  "clientInformation": {
    ar: "بيانات العميل",
    en: "Client Information"
  },
  "existingClient": {
    ar: "عميل موجود",
    en: "Existing Client"
  },
  "sphere": {
    ar: "المحدب",
    en: "Sphere"
  },
  "cylinder": {
    ar: "الاسطواني",
    en: "Cylinder"
  },
  "axis": {
    ar: "المحور",
    en: "Axis"
  },
  "add": {
    ar: "الإضافة",
    en: "Add"
  },
  "pd": {
    ar: "المسافة بين البؤبؤين",
    en: "PD"
  },
  "rightEye": {
    ar: "العين اليمنى (OD)",
    en: "Right Eye (OD)"
  },
  "leftEye": {
    ar: "العين اليسرى (OS)",
    en: "Left Eye (OS)"
  },
  "choose": {
    ar: "اختر...",
    en: "Choose..."
  },
  "addLens": {
    ar: "إضافة نوع عدسة",
    en: "Add Lens Type"
  },
  "addCoating": {
    ar: "إضافة طلاء",
    en: "Add Coating"
  },
  "addNewLensTitle": {
    ar: "إضافة نوع عدسة جديد",
    en: "Add New Lens Type"
  },
  "addNewLensDescription": {
    ar: "أدخل تفاصيل نوع العدسة الجديد أدناه",
    en: "Enter new lens type details below"
  },
  "lensName": {
    ar: "اسم العدسة",
    en: "Lens Name"
  },
  "lensNameExample": {
    ar: "مثال: عدسات القراءة الممتازة",
    en: "Example: Premium Reading Lenses"
  },
  "type": {
    ar: "النوع",
    en: "Type"
  },
  "addNewCoatingTitle": {
    ar: "إضافة طلاء جديد",
    en: "Add New Coating"
  },
  "addNewCoatingDescription": {
    ar: "أدخل تفاصيل الطلاء الجديد أدناه",
    en: "Enter new coating details below"
  },
  "coatingName": {
    ar: "اسم الطلاء",
    en: "Coating Name"
  },
  "coatingNameExample": {
    ar: "مثال: مضاد للانعكاس",
    en: "Example: Anti-reflective"
  },
  "description": {
    ar: "الوصف",
    en: "Description"
  },
  "coatingDescription": {
    ar: "وصف مختصر للطلاء",
    en: "Brief description of coating"
  },
  "fillRequiredFields": {
    ar: "يرجى ملء جميع الحقول المطلوبة",
    en: "Please fill in all required fields"
  },
  "lensAddedSuccess": {
    ar: "تمت إضافة نوع العدسة بنجاح",
    en: "Lens type added successfully"
  },
  "coatingAddedSuccess": {
    ar: "تمت إضافة الطلاء بنجاح",
    en: "Coating added successfully"
  },
  "lensUpdatedSuccess": {
    ar: "تم تحديث نوع العدسة بنجاح",
    en: "Lens type updated successfully"
  },
  "coatingUpdatedSuccess": {
    ar: "تم تحديث الطلاء بنجاح",
    en: "Coating updated successfully"
  },
  "lensDeletedSuccess": {
    ar: "تم حذف نوع العدسة بنجاح",
    en: "Lens type deleted successfully"
  },
  "coatingDeletedSuccess": {
    ar: "تم حذف الطلاء بنجاح",
    en: "Coating deleted successfully"
  },
  "noLensesInCategory": {
    ar: "لا توجد عدسات في هذه الفئة",
    en: "No lenses in this category"
  },
  "noCoatings": {
    ar: "لا توجد طلاءات للعدسات",
    en: "No lens coatings"
  },
  "editCoating": {
    ar: "تعديل الطلاء",
    en: "Edit Coating"
  },
  "updateCoatingDetails": {
    ar: "قم بتحديث تفاصيل الطلاء أدناه",
    en: "Update coating details below"
  },
  "editLensType": {
    ar: "تعديل نوع العدسة",
    en: "Edit Lens Type"
  },
  "updateLensDetails": {
    ar: "قم بتحديث تفاصيل نوع العدسة أدناه",
    en: "Update lens type details below"
  },
  "saveChanges": {
    ar: "حفظ التغييرات",
    en: "Save Changes"
  },
  // Lens Type Categories
  "distance": {
    ar: "النظر البعيد",
    en: "Distance"
  },
  "reading": {
    ar: "القراءة",
    en: "Reading"
  },
  "progressive": {
    ar: "التقدمية",
    en: "Progressive"
  },
  "bifocal": {
    ar: "ثنائية البؤرة",
    en: "Bifocal"
  },
  "sunglasses": {
    ar: "النظارات الشمسية",
    en: "Sunglasses"
  },
  // Invoice Creation Additional Translations
  "createInvoiceTitle": {
    ar: "إنشاء فاتورة",
    en: "Create Invoice"
  },
  "medicalGlasses": {
    ar: "النظارات الطبية",
    en: "Prescription Glasses"
  },
  "addGlassesItemBtn": {
    ar: "إضافة نظارة",
    en: "Add Glasses"
  },
  "selectClient": {
    ar: "اختيار عميل",
    en: "Select Client"
  },
  "invoiceItems": {
    ar: "عناصر الفاتورة",
    en: "Invoice Items"
  },
  "selectLensType": {
    ar: "اختر نوع العدسة",
    en: "Select Lens Type"
  },
  "selectFrameType": {
    ar: "اختر الإطار",
    en: "Select Frame"
  },
  "selectCoating": {
    ar: "اختر الطلاء",
    en: "Select Coating"
  },
  "addAnotherPayment": {
    ar: "إضافة دفعة أخرى",
    en: "Add Another Payment"
  },
  "paymentType": {
    ar: "نوع الدفع",
    en: "Payment Type"
  },
  "visa": {
    ar: "فيزا",
    en: "Visa"
  },
  "masterCard": {
    ar: "ماستركارد",
    en: "MasterCard"
  },
  "invoiceValue": {
    ar: "قيمة الفاتورة",
    en: "Invoice Value"
  },
  "totalInvoice": {
    ar: "إجمالي الفاتورة",
    en: "Total Invoice"
  },
  "discountAndTax": {
    ar: "الخصم والضريبة",
    en: "Discount & Tax"
  },
  "applyTaxInvoice": {
    ar: "تطبيق ضريبة الفاتورة",
    en: "Apply Invoice Tax"
  },
  "tax": {
    ar: "الضريبة",
    en: "Tax"
  },
  "applyDiscount": {
    ar: "تطبيق خصم",
    en: "Apply Discount"
  },
  "percentageValue": {
    ar: "القيمة المئوية",
    en: "Percentage Value"
  },
  "discountAmount": {
    ar: "مبلغ الخصم",
    en: "Discount Amount"
  },
  "paymentMethod": {
    ar: "طريقة الدفع",
    en: "Payment Method"
  },
  "saveInvoice": {
    ar: "حفظ الفاتورة",
    en: "Save Invoice"
  },
  "printAndSave": {
    ar: "طباعة وحفظ",
    en: "Print & Save"
  },
  "searchClient": {
    ar: "البحث عن عميل",
    en: "Search for Client"
  },
  "enterClientNameOrPhone": {
    ar: "أدخل اسم العميل أو رقم الهاتف",
    en: "Enter client name or phone number"
  },
  "select": {
    ar: "اختيار",
    en: "Select"
  },
  "paymentDate": {
    ar: "تاريخ الدفع",
    en: "Payment Date"
  },
  // Patient/Client Search Additional Translations
  "clientSearch": {
    ar: "بحث عن عميل",
    en: "Client Search"  
  },
  "clientSearchDescription": {
    ar: "البحث عن العملاء وإدارة ملفاتهم وتاريخهم",
    en: "Search for clients and manage their profiles and history"
  },
  "searchResults": {
    ar: "نتائج البحث",
    en: "Search Results"
  },
  "noClientsFound": {
    ar: "لم يتم العثور على عملاء",
    en: "No clients found"
  },
  "clientDetails": {
    ar: "تفاصيل العميل",
    en: "Client Details"
  },
  "clientFile": {
    ar: "ملف العميل",
    en: "Client File"
  },
  "visitHistory": {
    ar: "سجل الزيارات",
    en: "Visit History"
  },
  "transactionHistory": {
    ar: "سجل المعاملات",
    en: "Transaction History"
  },
  "prescriptionHistory": {
    ar: "سجل الوصفات الطبية",
    en: "Prescription History"
  },
  "contactLensPrescription": {
    ar: "وصفة العدسات اللاصقة",
    en: "Contact Lens Prescription"
  },
  "createNewPrescription": {
    ar: "إنشاء وصفة طبية جديدة",
    en: "Create New Prescription"
  },
  "viewPrescription": {
    ar: "عرض الوصفة الطبية",
    en: "View Prescription"
  },
  "printPrescription": {
    ar: "طباعة الوصفة الطبية",
    en: "Print Prescription"
  },
  "currentPrescription": {
    ar: "الوصفة الطبية الحالية",
    en: "Current Prescription"
  },
  "careInstructions": {
    ar: "تعليمات العناية",
    en: "Care Instructions"
  },
  "noHistoryFound": {
    ar: "لا يوجد سجل",
    en: "No history found"
  },
  "phoneNumber": {
    ar: "رقم الهاتف",
    en: "Phone Number"
  },
  "lastVisit": {
    ar: "آخر زيارة",
    en: "Last Visit"
  },
  // Additional RX Manager Translations
  "rxAndCareInstructions": {
    ar: "الوصفة الطبية وتعليمات العناية",
    en: "Prescription & Care Instructions"
  },
  "currentRx": {
    ar: "الوصفة الطبية الحالية",
    en: "Current Prescription"
  },
  "rxHistory": {
    ar: "تاريخ الوصفات الطبية",
    en: "Prescription History"
  },
  "newRx": {
    ar: "وصفة جديدة",
    en: "New Prescription"
  },
  "addNewRx": {
    ar: "إضافة وصفة طبية جديدة",
    en: "Add New Prescription"
  },
  "addNewRxFor": {
    ar: "أدخل بيانات الوصفة الطبية الجديدة للمريض",
    en: "Enter new prescription data for patient"
  },
  "glassesCareTips": {
    ar: "تعليمات العناية بالنظارة",
    en: "Glasses Care Tips"
  },
  "tip1": {
    ar: "يجب تنظيف العدسات بانتظام بمنظف خاص",
    en: "Clean lenses regularly with a special cleaner"
  },
  "tip2": {
    ar: "تجنب ملامسة العدسات للماء الساخن",
    en: "Avoid hot water on lenses"
  },
  "tip3": {
    ar: "استخدم حافظة نظارات عند عدم الاستخدام",
    en: "Use a case when not wearing glasses"
  },
  "tip4": {
    ar: "راجع الطبيب كل 6-12 شهر",
    en: "See your doctor every 6-12 months"
  },
  "noPreviousRx": {
    ar: "لا يوجد سجل وصفات طبية سابقة",
    en: "No previous prescription records"
  },
  "noPreviousRxDescription": {
    ar: "لم يتم تسجيل أي وصفات طبية سابقة لهذا المريض",
    en: "No previous prescriptions have been recorded for this patient"
  },
  "dataError": {
    ar: "خطأ في البيانات",
    en: "Data Error"
  },
  "fillAllRequiredFields": {
    ar: "يرجى ملء جميع الحقول المطلوبة",
    en: "Please fill all required fields"
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
