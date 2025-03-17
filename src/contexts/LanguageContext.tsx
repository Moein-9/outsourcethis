
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
  },
  
  // Lens Type Manager
  "lens_types": {
    ar: "أنواع العدسات",
    en: "Lens Types"
  },
  "add_lens_type": {
    ar: "إضافة نوع عدسة",
    en: "Add Lens Type"
  },
  "add_new_lens_type": {
    ar: "إضافة نوع عدسة جديد",
    en: "Add New Lens Type"
  },
  "enter_lens_details": {
    ar: "أدخل تفاصيل نوع العدسة الجديد أدناه",
    en: "Enter new lens type details below"
  },
  "lens_name": {
    ar: "اسم العدسة",
    en: "Lens Name"
  },
  "price": {
    ar: "السعر (د.ك)",
    en: "Price (KD)"
  },
  "type": {
    ar: "النوع",
    en: "Type"
  },
  "select_lens_type": {
    ar: "اختر نوع العدسة",
    en: "Select lens type"
  },
  "add": {
    ar: "إضافة",
    en: "Add"
  },
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
  "no_lenses": {
    ar: "لا توجد عدسات في هذه الفئة",
    en: "No lenses in this category"
  },
  "edit_lens_type": {
    ar: "تعديل نوع العدسة",
    en: "Edit Lens Type"
  },
  "update_lens_details": {
    ar: "قم بتحديث تفاصيل نوع العدسة أدناه",
    en: "Update lens type details below"
  },
  "save_changes": {
    ar: "حفظ التغييرات",
    en: "Save Changes"
  },
  
  // Frame Label Template
  "frame_labels": {
    ar: "طباعة بطاقات الإطارات",
    en: "Print Frame Labels"
  },
  "select_all": {
    ar: "تحديد الكل",
    en: "Select All"
  },
  "deselect_all": {
    ar: "إلغاء تحديد الكل",
    en: "Deselect All"
  },
  "print_labels": {
    ar: "طباعة البطاقات",
    en: "Print Labels"
  },
  "no_frames": {
    ar: "لا توجد إطارات",
    en: "No Frames"
  },
  "no_frames_inventory": {
    ar: "لا توجد إطارات في المخزون حاليًا",
    en: "No frames in inventory currently"
  },
  "preview_labels": {
    ar: "معاينة بطاقات الإطارات",
    en: "Preview Frame Labels"
  },
  "zebra_printer_setup": {
    ar: "ستتم طباعة البطاقات التالية. تأكد من إعداد طابعة Zebra وتحديد الحجم الصحيح (100مم × 16مم)",
    en: "The following labels will be printed. Make sure to set up the Zebra printer and select the correct size (100mm × 16mm)"
  },
  "print": {
    ar: "طباعة",
    en: "Print"
  },
  "labels_sent": {
    ar: "تم إرسال بطاقة للطباعة",
    en: "Labels sent to printer"
  },
  "please_select": {
    ar: "يرجى تحديد إطار واحد على الأقل للطباعة",
    en: "Please select at least one frame to print"
  },
  
  // Contact Lens Form
  "contact_lens_prescription": {
    ar: "وصفة العدسات اللاصقة",
    en: "Contact Lens Prescription"
  },
  "no_prescription_warning": {
    ar: "لا توجد وصفة عدسات لاصقة لهذا العميل. يرجى إدخال وصفة العدسات",
    en: "No contact lens prescription for this client. Please enter lens prescription"
  },
  "sphere": {
    ar: "SPHERE (SPH)",
    en: "SPHERE (SPH)"
  },
  "cylinder": {
    ar: "CYLINDER (CYL)",
    en: "CYLINDER (CYL)"
  },
  "axis": {
    ar: "AXIS",
    en: "AXIS"
  },
  "base_curve": {
    ar: "BASE CURVE (BC)",
    en: "BASE CURVE (BC)"
  },
  "diameter": {
    ar: "DIAMETER (DIA)",
    en: "DIAMETER (DIA)"
  },
  "right_eye": {
    ar: "العين اليمنى (OD)",
    en: "Right Eye (OD)"
  },
  "left_eye": {
    ar: "العين اليسرى (OS)",
    en: "Left Eye (OS)"
  },
  
  // Lens Selector
  "select_lens_type_title": {
    ar: "اختر نوع العدسة",
    en: "Select Lens Type"
  },
  "select_coatings": {
    ar: "اختر الطلاءات",
    en: "Select Coatings"
  },
  "coatings_selected": {
    ar: "طلاء محدد",
    en: "coating selected"
  },
  "current_selections": {
    ar: "الاختيارات الحالية",
    en: "Current Selections"
  },
  "no_coatings": {
    ar: "لا توجد طلاءات متاحة",
    en: "No coatings available"
  },
  
  // Sales Chart
  "no_data": {
    ar: "لا توجد بيانات للعرض",
    en: "No data to display"
  },
  
  // Client Form - Personal Information
  "personal_information": {
    ar: "المعلومات الشخصية",
    en: "Personal Information"
  },
  "name": {
    ar: "الاسم",
    en: "Name"
  },
  "full_name": {
    ar: "الاسم الكامل",
    en: "Full Name"
  },
  "phone": {
    ar: "الهاتف",
    en: "Phone"
  },
  // phone_number is already defined above
  "birth_date": {
    ar: "تاريخ الميلاد",
    en: "Birth Date"
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
  "client_didnt_share_birthdate": {
    ar: "لم يشارك العميل تاريخ الميلاد",
    en: "Client did not share birth date"
  },
  "notes": {
    ar: "ملاحظات",
    en: "Notes"
  },
  "client_notes": {
    ar: "ملاحظات أو تفصيلات العميل",
    en: "Client notes or details"
  },
  
  // Frame Section
  "frame": {
    ar: "الإطار",
    en: "Frame"
  },
  // search is already defined above
  "search_example": {
    ar: "مثال: RayBan...",
    en: "Example: RayBan..."
  },
  "add_new_frame": {
    ar: "إضافة إطار جديد",
    en: "Add New Frame"
  },
  "search_brand_model_color_size": {
    ar: "بحث (Brand/Model/Color/Size):",
    en: "Search (Brand/Model/Color/Size):"
  },
  
  // Discount and Payment
  "discount_and_payment": {
    ar: "الخصم والدفعة",
    en: "Discount and Payment"
  },
  "discount": {
    ar: "الخصم (د.ك)",
    en: "Discount (KD)"
  },
  "payment": {
    ar: "الدفعة (د.ك)",
    en: "Payment (KD)"
  },
  "full_payment": {
    ar: "دفع كامل",
    en: "Full Payment"
  },
  
  // Payment Methods
  "payment_method": {
    ar: "طريقة الدفع",
    en: "Payment Method"
  },
  "cash": {
    ar: "نقداً",
    en: "Cash"
  },
  "knet": {
    ar: "كي نت",
    en: "KNET"
  },
  "visa": {
    ar: "Visa",
    en: "Visa"
  },
  "mastercard": {
    ar: "MasterCard",
    en: "MasterCard"
  },
  "print_client_order": {
    ar: "طباعة أمر العميل",
    en: "Print Client Order"
  },
  "preview_invoice": {
    ar: "معاينة الفاتورة",
    en: "Preview Invoice"
  },
  "save_and_print": {
    ar: "حفظ وطباعة",
    en: "Save and Print"
  },
  
  // Frame Inventory Management
  "frame_management": {
    ar: "إدارة الإطارات",
    en: "Frame Management"
  },
  "search_for_frame": {
    ar: "البحث عن إطار (ماركة، موديل، لون...)",
    en: "Search for frame (brand, model, color...)"
  },
  "print_labels_button": {
    ar: "طباعة البطاقات",
    en: "Print Labels"
  },
  "add_new_frame_button": {
    ar: "إضافة إطار جديد",
    en: "Add New Frame"
  },
  "in_stock": {
    ar: "في المخزون",
    en: "In Stock"
  },
  "color": {
    ar: "اللون",
    en: "Color"
  },
  "size": {
    ar: "المقاس",
    en: "Size"
  },
  "edit": {
    ar: "تعديل",
    en: "Edit"
  },
  "copy": {
    ar: "نسخ",
    en: "Copy"
  },
  "print_button": {
    ar: "طباعة",
    en: "Print"
  },
  
  // Client Search
  "client_search": {
    ar: "بحث عن عميل",
    en: "Client Search"
  },
  "search_by_name_or_phone": {
    ar: "ابحث بالاسم أو رقم الهاتف",
    en: "Search by name or phone number"
  },
  "search_button": {
    ar: "بحث",
    en: "Search"
  },
  
  // Brand and Model
  "brand": {
    ar: "الماركة",
    en: "Brand"
  },
  "model": {
    ar: "الموديل",
    en: "Model"
  },
  "add_frame": {
    ar: "إضافة إطار",
    en: "Add Frame"
  },
  "new_frame": {
    ar: "إطار جديد",
    en: "New Frame"
  },
  "enter_frame_details": {
    ar: "أدخل تفاصيل الإطار الجديد لإضافته إلى المخزون",
    en: "Enter the new frame details to add it to inventory"
  },
  "brand_placeholder": {
    ar: "مثال: RayBan",
    en: "Example: RayBan"
  },
  "model_placeholder": {
    ar: "مثال: RB3025",
    en: "Example: RB3025"
  },
  "color_placeholder": {
    ar: "مثال: أسود",
    en: "Example: Black"
  },
  "size_placeholder": {
    ar: "مثال: 52-18-145",
    en: "Example: 52-18-145"
  },
  "price_label": {
    ar: "السعر (KWD)",
    en: "Price (KWD)"
  },
  "quantity": {
    ar: "الكمية",
    en: "Quantity"
  },
  "save_frame": {
    ar: "حفظ الإطار",
    en: "Save Frame"
  },
  "show_all_frames": {
    ar: "عرض جميع الإطارات",
    en: "Show All Frames"
  },
  "no_matching_frames": {
    ar: "لم يتم العثور على إطارات مطابقة للبحث.",
    en: "No matching frames found."
  },
  
  // Client Form - Additional Translations
  "prescription_glasses": {
    ar: "نظارات طبية",
    en: "Prescription Glasses"
  },
  "contact_lenses": {
    ar: "عدسات لاصقة",
    en: "Contact Lenses"
  },
  "glasses_prescription": {
    ar: "وصفات النظارات",
    en: "Glasses Prescription"
  },
  "prescription_date": {
    ar: "تاريخ الوصفة الطبية",
    en: "Prescription Date"
  },
  "select_prescription_date": {
    ar: "اختر تاريخ الوصفة",
    en: "Select prescription date"
  },
  "select": {
    ar: "اختر...",
    en: "Select..."
  },
  "save_and_continue": {
    ar: "حفظ ومتابعة",
    en: "Save and Continue"
  },
  "error": {
    ar: "خطأ",
    en: "Error"
  },
  "name_field_required": {
    ar: "حقل الاسم مطلوب.",
    en: "Name field is required."
  },
  "saved": {
    ar: "تم الحفظ",
    en: "Saved"
  },
  "client_data_saved": {
    ar: "تم حفظ بيانات العميل بنجاح.",
    en: "Client data saved successfully."
  },
  
  // Create Invoice Page
  "create_invoice_title": {
    ar: "إنشاء فاتورة",
    en: "Create Invoice"
  },
  "glasses": {
    ar: "نظارات",
    en: "Glasses"
  },
  // contact_lenses is already defined above
  "client_info": {
    ar: "بيانات العميل",
    en: "Client Information"
  },
  "no_client_file": {
    ar: "لا يوجد ملف عميل",
    en: "No client file"
  },
  // phone_number is already defined above
  // search is already defined above
  "write_to_search": {
    ar: "اكتب للبحث...",
    en: "Type to search..."
  },
  "medical_glasses": {
    ar: "النظارات الطبية",
    en: "Medical Glasses"
  },
  "frame_only": {
    ar: "إطار فقط (بدون عدسات)",
    en: "Frame only (no lenses)"
  },
  "invoice_summary": {
    ar: "ملخص الفاتورة",
    en: "Invoice Summary"
  },
  "total": {
    ar: "المجموع",
    en: "Total"
  },
  // search_brand_model_color_size is already defined above
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
