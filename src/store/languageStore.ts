import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Translations {
  home: string;
  patients: string;
  inventory: string;
  reports: string;
  settings: string;
  login: string;
  logout: string;
  register: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  submit: string;
  resetPassword: string;
  enterYourEmail: string;
  newPassword: string;
  saveNewPassword: string;
  currentLanguage: string;
  selectLanguage: string;
  english: string;
  arabic: string;
  general: string;
  account: string;
  security: string;
  appearance: string;
  system: string;
  light: string;
  dark: string;
  auto: string;
  language: string;
  save: string;
  cancel: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  updateProfile: string;
  changePassword: string;
  oldPassword: string;
  newPasswordAgain: string;
  updatePassword: string;
  deleteAccount: string;
  deleteAccountConfirmation: string;
  iUnderstand: string;
  deleteMyAccount: string;
  patientDetails: string;
  addNewPatient: string;
  editPatient: string;
  patientName: string;
  dateOfBirth: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  medicalHistory: string;
  allergies: string;
  medications: string;
  notes: string;
  updatePatient: string;
  createPatient: string;
  searchPatient: string;
  noPatientsFound: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  price: string;
  quantity: string;
  addNewFrame: string;
  editFrame: string;
  updateFrame: string;
  createFrame: string;
  searchForFrame: string;
  noFramesFound: string;
  dailySalesReport: string;
  overviewOfSales: string;
  salesInfo: string;
  paymentInfo: string;
  refundInfo: string;
  invoiceId: string;
  patientNameLabel: string;
  date: string;
  amount: string;
  paymentMethod: string;
  refundMethod: string;
  refundId: string;
  method: string;
  refundDate: string;
  totalSales: string;
  totalPayments: string;
  refundAmount: string;
  reportsPageTitle: string;
  selectReportType: string;
  daily: string;
  monthly: string;
  yearly: string;
  custom: string;
  generateReport: string;
  printReport: string;
  noDataAvailable: string;
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
  year: string;
  loading: string;
  addNewFrameTitle: string;
  addNewFrameDescription: string;
  brandExample: string;
  modelExample: string;
  colorExample: string;
  sizeExample: string;
  quantityLabel: string;
  saveFrame: string;
  pleaseEnterCompleteFrameDetails: string;
  pleaseEnterValidPrice: string;
  pleaseEnterValidQuantity: string;
  frameAddedSuccessfully: string;
  search: string;
  printLabels: string;
  printFrameLabels: string;
  selectFramesForLabels: string;
  close: string;
  selectedFrames: string;
  selectAll: string;
  deselectAll: string;
  printSelected: string;
  selectFramesToPrint: string;
  labelPreview: string;
  noFramesAvailable: string;
  lensDetails: string;
  lensType: string;
  coating: string;
  lensPrice: string;
  frameDetails: string;
  frameBrand: string;
  frameModel: string;
  frameColor: string;
  frameSize: string;
  framePrice: string;
  workOrderDetails: string;
  invoiceNumber: string;
  orderNumber: string;
  thankYou: string;
  paymentSection: string;
  paymentMethodLabel: string;
  amountLabel: string;
  printWorkOrder: string;
  workOrderPreview: string;
  previewBeforePrinting: string;
  print: string;
  printing: string;
  saving: string;
  invoiceSaved: string;
  error: string;
  errorSavingInvoice: string;
  kwd: string;
  deposit: string;
  discount: string;
  total: string;
  authNumber: string;
  paymentInformation: string;
  description: string;
  edit: string;
  copy: string;
  noFramesMatchingSearch: string;
  showAllFrames: string;
  frameNotFound: string;
  errorGeneratingQRCode: string;
  labelPrintedSuccessfully: string;
  noFramesSelected: string;
  noFramesFound: string;
  errorGeneratingQRCodes: string;
  labelsPrintedSuccessfully: string;
  pendingOrders: string;
  completedOrders: string;
  archived: string;
  workOrders: string;
  transactions: string;
  noPendingOrders: string;
  noCompletedOrders: string;
  noArchivedOrders: string;
  noRefundedTransactions: string;
  notPickedUp: string;
  edited: string;
  unpaid: string;
  paid: string;
  markAsPickedUp: string;
  printInvoice: string;
  printWorkOrderLabel: string;
  contactLens: string;
  glasses: string;
  contactLenses: string;
  rxDetails: string;
  power: string;
  bc: string;
  diameter: string;
  cylinder: string;
  axis: string;
  add: string;
  visualAcuity: string;
  contactLensSolution: string;
  contactLensType: string;
  contactLensBrand: string;
  contactLensPrice: string;
  contactLensCoating: string;
  contactLensCoatingPrice: string;
  contactLensDetails: string;
  addNewContactLens: string;
  editContactLens: string;
  updateContactLens: string;
  createContactLens: string;
  searchForContactLens: string;
  noContactLensesFound: string;
  contactLensAddedSuccessfully: string;
  pleaseEnterCompleteContactLensDetails: string;
  pleaseEnterValidContactLensPrice: string;
  contactLensBrandExample: string;
  contactLensTypeExample: string;
  contactLensSolutionExample: string;
  contactLensPriceExample: string;
  contactLensCoatingExample: string;
  contactLensPowerExample: string;
  contactLensDiameterExample: string;
  contactLensBcExample: string;
  contactLensCylinderExample: string;
  contactLensAxisExample: string;
  contactLensAddExample: string;
  contactLensVisualAcuityExample: string;
  contactLensDetailsTitle: string;
  contactLensDetailsDescription: string;
  contactLensBrandLabel: string;
  contactLensTypeLabel: string;
  contactLensSolutionLabel: string;
  contactLensPriceLabel: string;
  contactLensCoatingLabel: string;
  contactLensPowerLabel: string;
  contactLensDiameterLabel: string;
  contactLensBcLabel: string;
  contactLensCylinderLabel: string;
  contactLensAxisLabel: string;
  contactLensAddLabel: string;
  contactLensVisualAcuityLabel: string;
  contactLensPrintLabel: string;
  contactLensLabelPreview: string;
  contactLensSelectContactLensesToPrint: string;
  contactLensNoContactLensesAvailable: string;
  contactLensSelectedContactLenses: string;
  contactLensSelectAll: string;
  contactLensDeselectAll: string;
  contactLensPrintSelected: string;
  contactLensNoContactLensesMatchingSearch: string;
  contactLensShowAllContactLenses: string;
  contactLensNotFound: string;
  contactLensErrorGeneratingQRCode: string;
  contactLensLabelPrintedSuccessfully: string;
  contactLensNoContactLensesSelected: string;
  contactLensNoContactLensesFound: string;
  contactLensErrorGeneratingQRCodes: string;
  contactLensLabelsPrintedSuccessfully: string;
  contactLensPrintLabelsTitle: string;
  contactLensPrintLabelsDescription: string;
  contactLensPrintLabelPreview: string;
  contactLensSelectContactLenses: string;
  contactLensSelectContactLensesToPrintLabel: string;
  contactLensNoContactLensesAvailableToPrint: string;
  contactLensSelectedContactLensesCount: string;
  contactLensSelectAllContactLenses: string;
  contactLensDeselectAllContactLenses: string;
  contactLensPrintSelectedContactLenses: string;
  contactLensNoContactLensesMatchingSearchFound: string;
  contactLensShowAllContactLensesAvailable: string;
  contactLensContactLensNotFound: string;
  contactLensErrorGeneratingContactLensQRCode: string;
  contactLensContactLensLabelPrintedSuccessfully: string;
  contactLensNoContactLensesSelectedToPrint: string;
  contactLensNoContactLensesFoundToPrint: string;
  contactLensErrorGeneratingContactLensQRCodes: string;
  contactLensContactLensLabelsPrintedSuccessfully: string;
  contactLensPrintContactLensLabels: string;
  contactLensPrintContactLensLabel: string;
}

const en: Translations = {
  home: "Home",
  patients: "Patients",
  inventory: "Inventory",
  reports: "Reports",
  settings: "Settings",
  login: "Login",
  logout: "Logout",
  register: "Register",
  name: "Name",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm Password",
  submit: "Submit",
  resetPassword: "Reset Password",
  enterYourEmail: "Enter your email",
  newPassword: "New Password",
  saveNewPassword: "Save New Password",
  currentLanguage: "Current Language",
  selectLanguage: "Select Language",
  english: "English",
  arabic: "Arabic",
  general: "General",
  account: "Account",
  security: "Security",
  appearance: "Appearance",
  system: "System",
  light: "Light",
  dark: "Dark",
  auto: "Auto",
  language: "Language",
  save: "Save",
  cancel: "Cancel",
  firstName: "First Name",
  lastName: "Last Name",
  phoneNumber: "Phone Number",
  address: "Address",
  city: "City",
  state: "State",
  zipCode: "Zip Code",
  country: "Country",
  updateProfile: "Update Profile",
  changePassword: "Change Password",
  oldPassword: "Old Password",
  newPasswordAgain: "New Password Again",
  updatePassword: "Update Password",
  deleteAccount: "Delete Account",
  deleteAccountConfirmation: "Are you sure you want to delete your account?",
  iUnderstand: "I understand that this action is irreversible.",
  deleteMyAccount: "Delete My Account",
  patientDetails: "Patient Details",
  addNewPatient: "Add New Patient",
  editPatient: "Edit Patient",
  patientName: "Patient Name",
  dateOfBirth: "Date of Birth",
  gender: "Gender",
  male: "Male",
  female: "Female",
  other: "Other",
  medicalHistory: "Medical History",
  allergies: "Allergies",
  medications: "Medications",
  notes: "Notes",
  updatePatient: "Update Patient",
  createPatient: "Create Patient",
  searchPatient: "Search Patient",
  noPatientsFound: "No patients found.",
  brand: "Brand",
  model: "Model",
  color: "Color",
  size: "Size",
  price: "Price",
  quantity: "Quantity",
  addNewFrame: "Add New Frame",
  editFrame: "Edit Frame",
  updateFrame: "Update Frame",
  createFrame: "Create Frame",
  searchForFrame: "Search for frame...",
  noFramesFound: "No frames found.",
  dailySalesReport: "Daily Sales Report",
  overviewOfSales: "Overview of sales for the current day",
  salesInfo: "Sales Information",
  paymentInfo: "Payment Information",
  refundInfo: "Refund Information",
  invoiceId: "Invoice ID",
  patientNameLabel: "Patient Name",
  date: "Date",
  amount: "Amount",
  paymentMethod: "Payment Method",
  refundMethod: "Refund Method",
  refundId: "Refund ID",
  method: "Method",
  refundDate: "Refund Date",
  totalSales: "Total Sales",
  totalPayments: "Total Payments",
  refundAmount: "Refund Amount",
  reportsPageTitle: "Reports",
  selectReportType: "Select Report Type",
  daily: "Daily",
  monthly: "Monthly",
  yearly: "Yearly",
  custom: "Custom",
  generateReport: "Generate Report",
  printReport: "Print Report",
  noDataAvailable: "No data available for the selected period.",
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
  june: "June",
  july: "July",
  august: "August",
  september: "September",
  october: "October",
  november: "November",
  december: "December",
  year: "Year",
  loading: "Loading...",
  addNewFrameTitle: "Add a new frame",
  addNewFrameDescription:
    "Enter the details for the new frame to add it to the inventory.",
  brandExample: "e.g., Ray-Ban",
  modelExample: "e.g., RB3447",
  colorExample: "e.g., Gold",
  sizeExample: "e.g., 50-21",
  quantityLabel: "Quantity",
  saveFrame: "Save Frame",
  pleaseEnterCompleteFrameDetails:
    "Please enter complete frame details including brand, model, color and price.",
  pleaseEnterValidPrice: "Please enter a valid price.",
  pleaseEnterValidQuantity: "Please enter a valid quantity.",
  frameAddedSuccessfully: "Frame {brand} {model} added successfully!",
  search: "Search",
  printLabels: "Print Labels",
  printFrameLabels: "Print Frame Labels",
  selectFramesForLabels: "Select frames for generating labels",
  close: "Close",
  selectedFrames: "Selected Frames",
  selectAll: "Select All",
  deselectAll: "Deselect All",
  printSelected: "Print Selected",
  selectFramesToPrint: "Select frames to print labels.",
  labelPreview: "Label Preview",
  noFramesAvailable: "No frames available.",
  lensDetails: "Lens Details",
  lensType: "Lens Type",
  coating: "Coating",
  lensPrice: "Lens Price",
  frameDetails: "Frame Details",
  frameBrand: "Frame Brand",
  frameModel: "Frame Model",
  frameColor: "Frame Color",
  frameSize: "Frame Size",
  framePrice: "Frame Price",
  workOrderDetails: "Work Order Details",
  invoiceNumber: "Invoice Number",
  orderNumber: "Order Number",
  thankYou: "Thank you!",
  paymentSection: "Payment Section",
  paymentMethodLabel: "Payment Method",
  amountLabel: "Amount",
  printWorkOrder: "Print Work Order",
  workOrderPreview: "Work Order Preview",
  previewBeforePrinting: "Preview before printing",
  print: "Print",
  printing: "Printing...",
  saving: "Saving...",
  invoiceSaved: "Invoice saved!",
  error: "Error!",
  errorSavingInvoice: "Error saving invoice.",
  kwd: "KWD",
  deposit: "Deposit",
  discount: "Discount",
  total: "Total",
  authNumber: "Auth Number",
  paymentInformation: "Payment Information",
  description: "Description",
  edit: "Edit",
  copy: "Copy",
  noFramesMatchingSearch: "No frames matching the search criteria.",
  showAllFrames: "Show All Frames",
  frameNotFound: "Frame not found.",
  errorGeneratingQRCode: "Error generating QR code.",
  labelPrintedSuccessfully: "Label printed successfully!",
  noFramesSelected: "No frames selected.",
  noFramesFound: "No frames found.",
  errorGeneratingQRCodes: "Error generating QR codes.",
  labelsPrintedSuccessfully: "Labels printed successfully!",
  pendingOrders: "Pending Orders",
  completedOrders: "Completed Orders",
  archived: "Archived",
  workOrders: "Work Orders",
  transactions: "Transactions",
  noPendingOrders: "No pending orders.",
  noCompletedOrders: "No completed orders.",
  noArchivedOrders: "No archived orders.",
  noRefundedTransactions: "No refunded transactions.",
  notPickedUp: "Not Picked Up",
  edited: "Edited",
  unpaid: "Unpaid",
  paid: "Paid",
  markAsPickedUp: "Mark as Picked Up",
  printInvoice: "Print Invoice",
  printWorkOrderLabel: "Print Work Order Label",
  contactLens: "Contact Lens",
  glasses: "Glasses",
  contactLenses: "Contact Lenses",
  rxDetails: "Rx Details",
  power: "Power",
  bc: "BC",
  diameter: "Diameter",
  cylinder: "Cylinder",
  axis: "Axis",
  add: "Add",
  visualAcuity: "Visual Acuity",
  contactLensSolution: "Contact Lens Solution",
  contactLensType: "Contact Lens Type",
  contactLensBrand: "Contact Lens Brand",
  contactLensPrice: "Contact Lens Price",
  contactLensCoating: "Contact Lens Coating",
  contactLensCoatingPrice: "Contact Lens Coating Price",
  contactLensDetails: "Contact Lens Details",
  addNewContactLens: "Add New Contact Lens",
  editContactLens: "Edit Contact Lens",
  updateContactLens: "Update Contact Lens",
  createContactLens: "Create Contact Lens",
  searchForContactLens: "Search for contact lens...",
  noContactLensesFound: "No contact lenses found.",
  contactLensAddedSuccessfully: "Contact lens added successfully!",
  pleaseEnterCompleteContactLensDetails:
    "Please enter complete contact lens details.",
  pleaseEnterValidContactLensPrice: "Please enter a valid contact lens price.",
  contactLensBrandExample: "e.g., Acuvue",
  contactLensTypeExample: "e.g., Daily",
  contactLensSolutionExample: "e.g., Opti-Free",
  contactLensPriceExample: "e.g., 15.000",
  contactLensCoatingExample: "e.g., HydraGlyde",
  contactLensPowerExample: "e.g., -2.75",
  contactLensDiameterExample: "e.g., 14.2",
  contactLensBcExample: "e.g., 8.5",
  contactLensCylinderExample: "e.g., -0.75",
  contactLensAxisExample: "e.g., 180",
  contactLensAddExample: "e.g., +2.50",
  contactLensVisualAcuityExample: "e.g., 20/20",
  contactLensDetailsTitle: "Contact Lens Details",
  contactLensDetailsDescription: "Enter the details for the contact lens.",
  contactLensBrandLabel: "Contact Lens Brand",
  contactLensTypeLabel: "Contact Lens Type",
  contactLensSolutionLabel: "Contact Lens Solution",
  contactLensPriceLabel: "Contact Lens Price",
  contactLensCoatingLabel: "Contact Lens Coating",
  contactLensPowerLabel: "Contact Lens Power",
  contactLensDiameterLabel: "Contact Lens Diameter",
  contactLensBcLabel: "Contact Lens BC",
  contactLensCylinderLabel: "Contact Lens Cylinder",
  contactLensAxisLabel: "Contact Lens Axis",
  contactLensAddLabel: "Contact Lens Add",
  contactLensVisualAcuityLabel: "Contact Lens Visual Acuity",
  contactLensPrintLabel: "Print Contact Lens Label",
  contactLensLabelPreview: "Contact Lens Label Preview",
  contactLensSelectContactLensesToPrint:
    "Select contact lenses for generating labels",
  contactLensNoContactLensesAvailable: "No contact lenses available.",
  contactLensSelectedContactLenses: "Selected Contact Lenses",
  contactLensSelectAll: "Select All",
  contactLensDeselectAll: "Deselect All",
  contactLensPrintSelected: "Print Selected",
  contactLensNoContactLensesMatchingSearch:
    "No contact lenses matching the search criteria.",
  contactLensShowAllContactLenses: "Show All Contact Lenses",
  contactLensNotFound: "Contact lens not found.",
  contactLensErrorGeneratingQRCode: "Error generating QR code.",
  contactLensLabelPrintedSuccessfully: "Contact lens label printed successfully!",
  contactLensNoContactLensesSelected: "No contact lenses selected.",
  contactLensNoContactLensesFound: "No contact lenses found.",
  contactLensErrorGeneratingQRCodes: "Error generating QR codes.",
  contactLensLabelsPrintedSuccessfully: "Contact lens labels printed successfully!",
  contactLensPrintContactLensLabels: "Print Contact Lens Labels",
  contactLensPrintContactLensLabel: "Print Contact Lens Label",
  contactLensPrintLabelsTitle: "Print Contact Lens Labels",
  contactLensPrintLabelsDescription: "Select contact lenses for generating labels",
  contactLensPrintLabelPreview: "Contact Lens Label Preview",
  contactLensSelectContactLenses: "Select contact lenses",
  contactLensSelectContactLensesToPrintLabel: "Select contact lenses to print labels.",
  contactLensNoContactLensesAvailableToPrint: "No contact lenses available to print.",
  contactLensSelectedContactLensesCount: "Selected Contact Lenses",
  contactLensSelectAllContactLenses: "Select All Contact Lenses",
  contactLensDeselectAllContactLenses: "Deselect All Contact Lenses",
  contactLensPrintSelectedContactLenses: "Print Selected Contact Lenses",
  contactLensNoContactLensesMatchingSearchFound: "No contact lenses matching the search criteria.",
  contactLensShowAllContactLensesAvailable: "Show All Contact Lenses",
  contactLensContactLensNotFound: "Contact lens not found.",
  contactLensErrorGeneratingContactLensQRCode: "Error generating QR code.",
  contactLensContactLensLabelPrintedSuccessfully: "Contact lens label printed successfully!",
  contactLensNoContactLensesSelectedToPrint: "No contact lenses selected.",
  contactLensNoContactLensesFoundToPrint: "No contact lenses found.",
  contactLensErrorGeneratingContactLensQRCodes: "Error generating QR codes.",
  contactLensContactLensLabelsPrintedSuccessfully: "Contact lens labels printed successfully!",
};

const ar: Translations = {
  home: "الرئيسية",
  patients: "المرضى",
  inventory: "المخزون",
  reports: "التقارير",
  settings: "الإعدادات",
  login: "تسجيل الدخول",
  logout: "تسجيل الخروج",
  register: "تسجيل",
  name: "الاسم",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  confirmPassword: "تأكيد كلمة المرور",
  submit: "إرسال",
  resetPassword: "إعادة تعيين كلمة المرور",
  enterYourEmail: "أدخل بريدك الإلكتروني",
  newPassword: "كلمة المرور الجديدة",
  saveNewPassword: "حفظ كلمة المرور الجديدة",
  currentLanguage: "اللغة الحالية",
  selectLanguage: "اختر اللغة",
  english: "الإنجليزية",
  arabic: "العربية",
  general: "عام",
  account: "الحساب",
  security: "الأمان",
  appearance: "المظهر",
  system: "النظام",
  light: "فاتح",
  dark: "داكن",
  auto: "تلقائي",
  language: "اللغة",
  save: "حفظ",
  cancel: "إلغاء",
  firstName: "الاسم الأول",
  lastName: "الاسم الأخير",
  phoneNumber: "رقم الهاتف",
  address: "العنوان",
  city: "المدينة",
  state: "الولاية",
  zipCode: "الرمز البريدي",
  country: "الدولة",
  updateProfile: "تحديث الملف الشخصي",
  changePassword: "تغيير كلمة المرور",
  oldPassword: "كلمة المرور القديمة",
  newPasswordAgain: "تأكيد كلمة المرور الجديدة",
  updatePassword: "تحديث كلمة المرور",
  deleteAccount: "حذف الحساب",
  deleteAccountConfirmation: "هل أنت متأكد أنك تريد حذف حسابك؟",
  iUnderstand: "أنا أفهم أن هذا الإجراء لا رجعة فيه.",
  deleteMyAccount: "حذف حسابي",
  patientDetails: "تفاصيل المريض",
  addNewPatient: "إضافة مريض جديد",
  editPatient: "تعديل مريض",
  patientName: "اسم المريض",
  dateOfBirth: "تاريخ الميلاد",
  gender: "الجنس",
  male: "ذكر",
  female: "أنثى",
  other: "آخر",
  medicalHistory: "التاريخ الطبي",
  allergies: "الحساسية",
  medications: "الأدوية",
  notes: "ملاحظات",
  updatePatient: "تحديث المريض",
  createPatient: "إنشاء مريض",
  searchPatient: "البحث عن مريض",
  noPatientsFound: "لم يتم العثور على مرضى.",
  brand: "العلامة التجارية",
  model: "النموذج",
  color: "اللون",
  size: "الحجم",
  price: "السعر",
  quantity: "الكمية",
  addNewFrame: "إضافة إطار جديد",
  editFrame: "تعديل إطار",
  updateFrame: "تحديث إطار",
  createFrame: "إنشاء إطار",
  searchForFrame: "البحث عن إطار...",
  noFramesFound: "لم يتم العثور على إطارات.",
  dailySalesReport: "تقرير المبيعات اليومية",
  overviewOfSales: "نظرة عامة على مبيعات اليوم الحالي",
  salesInfo: "معلومات المبيعات",
  paymentInfo: "معلومات الدفع",
  refundInfo: "معلومات الاسترداد",
  invoiceId: "رقم الفاتورة",
  patientNameLabel: "اسم المريض",
  date: "التاريخ",
  amount: "المبلغ",
  paymentMethod: "طريقة الدفع",
  refundMethod: "طريقة الاسترداد",
  refundId: "رقم الاسترداد",
  method: "الطريقة",
  refundDate: "تاريخ الاسترداد",
  totalSales: "إجمالي المبيعات",
  totalPayments: "إجمالي المدفوعات",
  refundAmount: "مبلغ الاسترداد",
  reportsPageTitle: "التقارير",
  selectReportType: "اختر نوع التقرير",
  daily: "يومي",
  monthly: "شهري",
  yearly: "سنوي",
  custom: "مخصص",
  generateReport: "إنشاء تقرير",
  printReport: "طباعة تقرير",
  noDataAvailable: "لا توجد بيانات متاحة للفترة المحددة.",
  january: "يناير",
  february: "فبراير",
  march: "مارس",
  april: "أبريل",
  may: "مايو",
  june: "يونيو",
  july: "يوليو",
  august: "أغسطس",
  september: "سبتمبر",
  october: "أكتوبر",
  november: "نوفمبر",
  december: "ديسمبر",
  year: "السنة",
  loading: "جار التحميل...",
  addNewFrameTitle: "إضافة إطار جديد",
  addNewFrameDescription: "أدخل تفاصيل الإطار الجديد لإضافته إلى المخزون.",
  brandExample: "مثال: Ray-Ban",
  modelExample: "مثال: RB3447",
  colorExample: "مثال: ذهبي",
  sizeExample: "مثال: 50-21",
  quantityLabel: "الكمية",
  saveFrame: "حفظ الإطار",
  pleaseEnterCompleteFrameDetails:
    "الرجاء إدخال تفاصيل الإطار كاملة بما في ذلك العلامة التجارية والنموذج واللون والسعر.",
  pleaseEnterValidPrice: "الرجاء إدخال سعر صالح.",
  pleaseEnterValidQuantity: "الرجاء إدخال كمية صالحة.",
  frameAddedSuccessfully: "تمت إضافة الإطار {brand} {model} بنجاح!",
  search: "بحث",
  printLabels: "طباعة الملصقات",
  printFrameLabels: "طباعة ملصقات الإطار",
  selectFramesForLabels: "حدد إطارات لإنشاء ملصقات",
  close: "إغلاق",
  selectedFrames: "الإطارات المحددة",
  selectAll: "تحديد الكل",
  deselectAll: "إلغاء تحديد الكل",
  printSelected: "طباعة المحدد",
  selectFramesToPrint: "حدد إطارات لطباعة الملصقات.",
  labelPreview: "معاينة الملصق",
  noFramesAvailable: "لا توجد إطارات متاحة.",
  lensDetails: "تفاصيل العدسة",
  lensType: "نوع العدسة",
  coating: "الطلاء",
  lensPrice: "سعر العدسة",
  frameDetails: "تفاصيل الإطار",
  frameBrand: "العلامة التجارية للإطار",
  frameModel: "نموذج الإطار",
  frameColor: "لون الإطار",
  frameSize: "حجم الإطار",
  framePrice: "سعر الإطار",
  workOrderDetails: "تفاصيل أمر العمل",
  invoiceNumber: "رقم الفاتورة",
  orderNumber: "رقم الطلب",
  thankYou: "شكرا لك!",
  paymentSection: "قسم الدفع",
  paymentMethodLabel: "طريقة الدفع",
  amountLabel: "المبلغ",
  printWorkOrder: "طباعة أمر العمل",
  workOrderPreview: "معاينة أمر العمل",
  previewBeforePrinting: "معاينة قبل الطباعة",
  print: "طباعة",
  printing: "جار الطباعة...",
  saving: "جار الحفظ...",
  invoiceSaved: "تم حفظ الفاتورة!",
  error: "خطأ!",
  errorSavingInvoice: "خطأ في حفظ الفاتورة.",
  kwd: "د.ك",
  deposit: "إيداع",
  discount: "خصم",
  total: "المجموع",
  authNumber: "رقم التفويض",
  paymentInformation: "معلومات الدفع",
  description: "وصف",
  edit: "تعديل",
  copy: "نسخ",
  noFramesMatchingSearch: "لا توجد إطارات تطابق معايير البحث.",
  showAllFrames: "عرض جميع الإطارات",
  frameNotFound: "الإطار غير موجود.",
  errorGeneratingQRCode: "خطأ في إنشاء رمز الاستجابة السريعة.",
  labelPrintedSuccessfully: "تمت طباعة الملصق بنجاح!",
  noFramesSelected: "لم يتم تحديد أي إطارات.",
  noFramesFound: "لم يتم العثور على إطارات.",
  errorGeneratingQRCodes: "خطأ في إنشاء رموز الاستجابة السريعة.",
  labelsPrintedSuccessfully: "تمت طباعة الملصقات بنجاح!",
  pendingOrders: "الطلبات المعلقة",
  completedOrders: "الطلبات المكتملة",
  archived: "أرشيف",
  workOrders: "أوامر العمل",
  transactions: "المعاملات",
  noPendingOrders: "لا توجد طلبات معلقة.",
  noCompletedOrders: "لا توجد طلبات مكتملة.",
  noArchivedOrders: "لا توجد طلبات مؤرشفة.",
  noRefundedTransactions: "لا توجد معاملات مستردة.",
  notPickedUp: "لم يتم الاستلام",
  edited: "تم التعديل",
  unpaid: "غير مدفوع",
  paid: "مدفوع",
  markAsPickedUp: "تحديد كتم الاستلام",
  printInvoice: "طباعة الفاتورة",
  printWorkOrderLabel: "طباعة ملصق أمر العمل",
  contactLens: "عدسة لاصقة",
  glasses: "نظارات",
  contactLenses: "العدسات اللاصقة",
   rxDetails: "تفاصيل الروشتة",
    power: "القوة",
    bc: "BC",
    diameter: "القطر",
    cylinder: "اسطوانة",
    axis: "محور",
    add: "إضافة",
    visualAcuity: "حدة البصر",
    contactLensSolution: "محلول العدسات اللاصقة",
    contactLensType: "نوع العدسة اللاصقة",
    contactLensBrand: "العلامة التجارية للعدسات اللاصقة",
    contactLensPrice: "سعر العدسات اللاصقة",
    contactLensCoating: "طلاء العدسات اللاصقة",
    contactLensCoatingPrice: "سعر طلاء العدسات اللاصقة",
    contactLensDetails: "تفاصيل العدسات اللاصقة",
    addNewContactLens: "إضافة عدسة لاصقة جديدة",
    editContactLens: "تعديل العدسة اللاصقة",
    updateContactLens: "تحديث العدسة اللاصقة",
    createContactLens: "إنشاء العدسة اللاصقة",
    searchForContactLens: "البحث عن العدسات اللاصقة...",
    noContactLensesFound: "لم يتم العثور على العدسات اللاصقة.",
    contactLensAddedSuccessfully: "تمت إضافة العدسة اللاصقة بنجاح!",
    pleaseEnterCompleteContactLensDetails: "الرجاء إدخال تفاصيل العدسة
