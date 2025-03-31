import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { DailySalesReport } from "@/components/reports/DailySalesReport";
import ComparativeAnalysis from "@/components/reports/ComparativeAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguageStore } from "@/store/languageStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LockKeyhole, Unlock, Eye, EyeOff } from "lucide-react";

const generateMockData = () => {
  const mockData = [];
  const today = new Date();
  const paymentMethods = ["نقداً", "كي نت", "Visa", "MasterCard"];
  const lensTypes = ["متعددة البؤر", "أحادية البؤر", "قراءة", "بعيدة المدى"];
  const coatings = ["مضاد للانعكاس", "مضاد للماء", "مضاد للخدش", "حماية من الأشعة الزرقاء"];
  const frameBrands = ["Ray-Ban", "Gucci", "Prada", "Oakley", "Dior", "Chanel"];
  
  for (let i = 0; i < 5; i++) {
    const lensPrice = Math.floor(Math.random() * 50 + 20) * 5;
    const framePrice = Math.floor(Math.random() * 80 + 40) * 5;
    const coatingPrice = Math.floor(Math.random() * 15 + 5) * 5;
    const total = lensPrice + framePrice + coatingPrice;
    const discount = Math.floor(Math.random() * 10) * 5;
    const finalTotal = total - discount;
    const deposit = Math.random() > 0.3 ? finalTotal : Math.floor(finalTotal * 0.7);
    
    mockData.push({
      patientName: `عميل ${i + 1}`,
      patientPhone: `9665${Math.floor(Math.random() * 10000000)}`,
      lensType: lensTypes[Math.floor(Math.random() * lensTypes.length)],
      lensPrice,
      coating: coatings[Math.floor(Math.random() * coatings.length)],
      coatingPrice,
      frameBrand: frameBrands[Math.floor(Math.random() * frameBrands.length)],
      frameModel: `موديل ${String.fromCharCode(65 + i)}`,
      frameColor: ["أسود", "بني", "أزرق", "ذهبي"][Math.floor(Math.random() * 4)],
      framePrice,
      discount,
      total: finalTotal,
      deposit,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    });
  }
  
  for (let d = 1; d < 60; d++) {
    const date = new Date();
    date.setDate(today.getDate() - d);
    
    const invoiceCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < invoiceCount; i++) {
      const lensPrice = Math.floor(Math.random() * 50 + 20) * 5;
      const framePrice = Math.floor(Math.random() * 80 + 40) * 5;
      const coatingPrice = Math.floor(Math.random() * 15 + 5) * 5;
      const total = lensPrice + framePrice + coatingPrice;
      const discount = Math.floor(Math.random() * 10) * 5;
      const finalTotal = total - discount;
      const deposit = Math.random() > 0.3 ? finalTotal : Math.floor(finalTotal * 0.7);
      
      const invoice = {
        patientName: `عميل ${d}${i}`,
        patientPhone: `9665${Math.floor(Math.random() * 10000000)}`,
        lensType: lensTypes[Math.floor(Math.random() * lensTypes.length)],
        lensPrice,
        coating: coatings[Math.floor(Math.random() * coatings.length)],
        coatingPrice,
        frameBrand: frameBrands[Math.floor(Math.random() * frameBrands.length)],
        frameModel: `موديل ${String.fromCharCode(65 + i)}`,
        frameColor: ["أسود", "بني", "أزرق", "ذهبي"][Math.floor(Math.random() * 4)],
        framePrice,
        discount,
        total: finalTotal,
        deposit,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      };
      
      const id = `INV${Date.now() - d * 86400000 - i}`;
      const createdAt = date.toISOString();
      const remaining = Math.max(0, finalTotal - deposit);
      const isPaid = remaining === 0;
      
      mockData.push({
        ...invoice,
        invoiceId: id,
        createdAt,
        remaining,
        isPaid
      });
    }
  }
  
  return mockData;
};

const ReportPage: React.FC = () => {
  const invoiceStore = useInvoiceStore();
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("daily");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  
  const correctPassword = "admin123";
  const securityQuestion = language === 'ar' 
    ? "ما هو اسم الشركة؟" 
    : "What is the company name?";
  const correctAnswer = "نظارات";
  
  const masterResetCode = "RESET987654";
  
  const translations = {
    reportsTitle: language === 'ar' ? "تقارير النظام" : "System Reports",
    createMockData: language === 'ar' ? "إنشاء بيانات تجريبية" : "Create Test Data",
    clearMockData: language === 'ar' ? "مسح البيانات التجريبية" : "Clear Test Data",
    mockDataNote: language === 'ar' 
      ? "ملاحظة: هذا الشريط للعرض فقط ويمكن إزالته عند استخدام بيانات حقيقية" 
      : "Note: This strip is for display only and can be removed when using real data",
    dailyReport: language === 'ar' ? "التقرير اليومي" : "Daily Report",
    comparativeAnalysis: language === 'ar' ? "التحليل المقارن" : "Comparative Analysis",
    signOut: language === 'ar' ? "تسجيل الخروج" : "Sign Out",
    loginToAccess: language === 'ar' ? "تسجيل الدخول للوصول إلى التحليل المقارن" : "Login to Access Comparative Analysis",
    enterPassword: language === 'ar' 
      ? "يرجى إدخال كلمة المرور للوصول إلى تقارير التحليل المقارن" 
      : "Please enter your password to access comparative analysis reports",
    password: language === 'ar' ? "كلمة المرور" : "Password",
    forgotPassword: language === 'ar' ? "نسيت كلمة المرور؟" : "Forgot password?",
    cancel: language === 'ar' ? "إلغاء" : "Cancel",
    login: language === 'ar' ? "تسجيل الدخول" : "Login",
    sectionProtected: language === 'ar' ? "هذا القسم محمي بكلمة مرور" : "This section is password protected",
    pleaseLogin: language === 'ar' 
      ? "يرجى تسجيل الدخول للوصول إلى التحليل المقارن" 
      : "Please login to access comparative analysis",
    resetPassword: language === 'ar' ? "استعادة كلمة المرور" : "Reset Password",
    resetInstructions: language === 'ar' 
      ? "يرجى الإجابة على سؤال الأمان أو إدخال رمز الاستعادة" 
      : "Please answer the security question or enter the recovery code",
    enterAnswer: language === 'ar' ? "أدخل الإجابة هنا" : "Enter your answer here",
    or: language === 'ar' ? "أو" : "or",
    recoveryCode: language === 'ar' ? "رمز الاستعادة" : "Recovery Code",
    enterRecoveryCode: language === 'ar' ? "أدخل رمز الاستعادة" : "Enter recovery code",
    restore: language === 'ar' ? "استعادة" : "Restore",
    loginSuccess: language === 'ar' ? "تم تسجيل الدخول بنجاح" : "Logged in successfully",
    logoutSuccess: language === 'ar' ? "تم تسجيل الخروج بنجاح" : "Logged out successfully",
    mockDataCreated: language === 'ar' ? "تم إنشاء بيانات تجريبية بنجاح" : "Test data created successfully",
    mockDataCleared: language === 'ar' ? "تم مسح البيانات التجريبية" : "Test data cleared successfully",
    wrongPassword: language === 'ar' ? "كلمة المرور غير صحيحة" : "Incorrect password",
    wrongAnswer: language === 'ar' ? "الإجابة غير صحيحة" : "Incorrect answer",
    passwordRevealed: language === 'ar' ? `كلمة المرور هي: ${correctPassword}` : `The password is: ${correctPassword}`,
    backToDashboard: language === 'ar' ? "العودة إلى لوحة التحكم" : "Back to Dashboard",
  };
  
  const handleNavigate = (section: string) => {
    navigate("/");
    setTimeout(() => {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        const event = new CustomEvent('navigate', { detail: { section } });
        rootElement.dispatchEvent(event);
      }
    }, 100);
  };
  
  useEffect(() => {
    const authStatus = localStorage.getItem("reportAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setPasswordDialogOpen(false);
      localStorage.setItem("reportAuth", "true");
      toast.success(translations.loginSuccess);
    } else {
      toast.error(translations.wrongPassword);
    }
    setPassword("");
    setShowPassword(false);
  };
  
  const handleResetSubmit = () => {
    if (
      (securityAnswer.toLowerCase() === correctAnswer.toLowerCase()) ||
      (resetCode === masterResetCode)
    ) {
      toast.success(translations.passwordRevealed);
      setResetDialogOpen(false);
    } else {
      toast.error(translations.wrongAnswer);
    }
    setSecurityAnswer("");
    setResetCode("");
  };
  
  const handleTabChange = (value: string) => {
    if (value === "comparative" && !isAuthenticated) {
      setPasswordDialogOpen(true);
    } else {
      setActiveTab(value);
    }
  };
  
  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("reportAuth");
    setActiveTab("daily");
    toast.success(translations.logoutSuccess);
  };
  
  const handleGenerateMockData = () => {
    invoiceStore.clearInvoices && invoiceStore.clearInvoices();
    const mockData = generateMockData();
    mockData.forEach(invoice => {
      if (invoice.invoiceId) {
        invoiceStore.addExistingInvoice && invoiceStore.addExistingInvoice(invoice);
      } else {
        invoiceStore.addInvoice(invoice);
      }
    });
    toast.success(translations.mockDataCreated);
  };
  
  const handleClearMockData = () => {
    invoiceStore.clearInvoices && invoiceStore.clearInvoices();
    toast.success(translations.mockDataCleared);
  };
  
  return (
    <Layout activeSection="reports" onNavigate={handleNavigate}>
      <div className="container px-4 py-6 md:px-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">{translations.reportsTitle}</h1>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-600 border-teal-200"
            onClick={() => handleNavigate("dashboard")}
          >
            {language === 'ar' ? "←" : "←"} {translations.backToDashboard}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <Button 
            variant="outline" 
            className="bg-amber-100 hover:bg-amber-200 border-amber-200 text-xs md:text-sm w-full sm:w-auto" 
            onClick={handleGenerateMockData}
          >
            {translations.createMockData}
          </Button>
          <Button 
            variant="outline" 
            className="bg-red-100 hover:bg-red-200 border-red-200 text-xs md:text-sm w-full sm:w-auto" 
            onClick={handleClearMockData}
          >
            {translations.clearMockData}
          </Button>
          <div className="flex-1 flex items-center text-amber-700 text-xs md:text-sm mx-2 mt-2 sm:mt-0">
            {translations.mockDataNote}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-2 mb-3 md:mb-0">
                <TabsTrigger value="daily" className="text-sm">{translations.dailyReport}</TabsTrigger>
                <TabsTrigger value="comparative" className="flex items-center gap-1 text-sm">
                  {!isAuthenticated && <LockKeyhole size={14} />}
                  {translations.comparativeAnalysis}
                </TabsTrigger>
              </TabsList>
              
              {isAuthenticated && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 text-gray-500 self-end md:self-auto mt-2 md:mt-0"
                  onClick={handleSignOut}
                >
                  <Unlock size={14} />
                  {translations.signOut}
                </Button>
              )}
            </div>

            <Card className="mt-4">
              <CardContent className="pt-6 p-3 md:p-6">
                <TabsContent value="daily" className="mt-0">
                  <DailySalesReport />
                </TabsContent>

                <TabsContent value="comparative" className="mt-0">
                  {isAuthenticated ? (
                    <ComparativeAnalysis />
                  ) : (
                    <div className="py-8 md:py-12 text-center">
                      <LockKeyhole className="h-8 w-8 md:h-12 md:w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">
                        {translations.sectionProtected}
                      </h3>
                      <p className="text-sm md:text-base text-gray-500 mb-4 px-4">
                        {translations.pleaseLogin}
                      </p>
                      <Button 
                        onClick={() => setPasswordDialogOpen(true)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {translations.login}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
        
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md max-w-[95vw]">
            <DialogHeader>
              <DialogTitle>{translations.loginToAccess}</DialogTitle>
              <DialogDescription>
                {translations.enterPassword}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="relative">
                <Label htmlFor="password" className="mb-2 block">
                  {translations.password}
                </Label>
                <div className="flex items-center relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handlePasswordSubmit();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row justify-between sm:justify-between gap-2">
              <Button
                variant="link"
                onClick={() => {
                  setPasswordDialogOpen(false);
                  setResetDialogOpen(true);
                }}
                className="self-start"
              >
                {translations.forgotPassword}
              </Button>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={() => setPasswordDialogOpen(false)} className="flex-1 sm:flex-none">
                  {translations.cancel}
                </Button>
                <Button onClick={handlePasswordSubmit} className="flex-1 sm:flex-none">
                  {translations.login}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>{translations.resetPassword}</AlertDialogTitle>
              <AlertDialogDescription>
                {translations.resetInstructions}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="securityQuestion" className="mb-2 block">
                  {securityQuestion}
                </Label>
                <Input
                  id="securityAnswer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder={translations.enterAnswer}
                />
              </div>
              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">{translations.or}</span>
                </div>
              </div>
              <div>
                <Label htmlFor="resetCode" className="mb-2 block">
                  {translations.recoveryCode}
                </Label>
                <Input
                  id="resetCode"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder={translations.enterRecoveryCode}
                />
              </div>
            </div>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="mt-0">{translations.cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetSubmit}>
                {translations.restore}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default ReportPage;
