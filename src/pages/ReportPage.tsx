
import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { DailySalesReport } from "@/components/reports/DailySalesReport";
import { ComparativeAnalysis } from "@/components/reports/ComparativeAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useInvoiceStore } from "@/store/invoiceStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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

// Mock data generator function
const generateMockData = () => {
  const mockData = [];
  const today = new Date();
  const paymentMethods = ["Cash", "KNET", "Visa", "MasterCard"];
  const lensTypes = ["Multifocal", "Single Vision", "Reading", "Distance"];
  const coatings = ["Anti-Reflective", "Water Resistant", "Scratch Resistant", "Blue Light Protection"];
  const frameBrands = ["Ray-Ban", "Gucci", "Prada", "Oakley", "Dior", "Chanel"];
  
  // Generate invoices for today
  for (let i = 0; i < 5; i++) {
    const lensPrice = Math.floor(Math.random() * 50 + 20) * 5;
    const framePrice = Math.floor(Math.random() * 80 + 40) * 5;
    const coatingPrice = Math.floor(Math.random() * 15 + 5) * 5;
    const total = lensPrice + framePrice + coatingPrice;
    const discount = Math.floor(Math.random() * 10) * 5;
    const finalTotal = total - discount;
    const deposit = Math.random() > 0.3 ? finalTotal : Math.floor(finalTotal * 0.7);
    
    mockData.push({
      patientName: `Customer ${i + 1}`,
      patientPhone: `9665${Math.floor(Math.random() * 10000000)}`,
      lensType: lensTypes[Math.floor(Math.random() * lensTypes.length)],
      lensPrice,
      coating: coatings[Math.floor(Math.random() * coatings.length)],
      coatingPrice,
      frameBrand: frameBrands[Math.floor(Math.random() * frameBrands.length)],
      frameModel: `Model ${String.fromCharCode(65 + i)}`,
      frameColor: ["Black", "Brown", "Blue", "Gold"][Math.floor(Math.random() * 4)],
      framePrice,
      discount,
      total: finalTotal,
      deposit,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
    });
  }
  
  // Generate invoices for previous days (for comparison)
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
      
      // Create invoice with past date
      const invoice = {
        patientName: `Customer ${d}${i}`,
        patientPhone: `9665${Math.floor(Math.random() * 10000000)}`,
        lensType: lensTypes[Math.floor(Math.random() * lensTypes.length)],
        lensPrice,
        coating: coatings[Math.floor(Math.random() * coatings.length)],
        coatingPrice,
        frameBrand: frameBrands[Math.floor(Math.random() * frameBrands.length)],
        frameModel: `Model ${String.fromCharCode(65 + i)}`,
        frameColor: ["Black", "Brown", "Blue", "Gold"][Math.floor(Math.random() * 4)],
        framePrice,
        discount,
        total: finalTotal,
        deposit,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      };
      
      // Manually set creation date to past date
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
  const [activeTab, setActiveTab] = useState("daily");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  
  // Default password and security question (in a real app, these would be stored in a database)
  const correctPassword = "admin123";
  const securityQuestion = "ما هو اسم الشركة؟";
  const correctAnswer = "optical"; // Example answer
  
  // Master reset code (would be different in production)
  const masterResetCode = "RESET987654";
  
  useEffect(() => {
    // Check if the user is already authenticated (could use local storage in a real app)
    const authStatus = localStorage.getItem("reportAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setPasswordDialogOpen(false);
      // Save authentication status
      localStorage.setItem("reportAuth", "true");
      toast.success("Successfully logged in");
    } else {
      toast.error("Incorrect password");
    }
    setPassword("");
    setShowPassword(false);
  };
  
  const handleResetSubmit = () => {
    if (
      (securityAnswer.toLowerCase() === correctAnswer.toLowerCase()) ||
      (resetCode === masterResetCode)
    ) {
      // Reset the password (in a real app, this would generate a new password)
      toast.success(`The password is: ${correctPassword}`);
      setResetDialogOpen(false);
    } else {
      toast.error("Incorrect answer");
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
    toast.success("Successfully logged out");
  };
  
  const handleGenerateMockData = () => {
    // First clear existing data
    invoiceStore.clearInvoices && invoiceStore.clearInvoices();
    
    // Generate and add mock data
    const mockData = generateMockData();
    mockData.forEach(invoice => {
      if (invoice.invoiceId) {
        // Add pre-dated invoice directly
        invoiceStore.addExistingInvoice && invoiceStore.addExistingInvoice(invoice);
      } else {
        // Add today's invoice
        invoiceStore.addInvoice(invoice);
      }
    });
    
    toast.success("Mock data successfully created");
  };
  
  const handleClearMockData = () => {
    invoiceStore.clearInvoices && invoiceStore.clearInvoices();
    toast.success("Mock data cleared");
  };
  
  return (
    <Layout activeSection="reports" onNavigate={() => {}}>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">تقارير النظام</h1>
        
        {/* Mock Data Controls - Remove this section when using real data */}
        <div className="flex gap-2 mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <Button 
            variant="outline" 
            className="bg-amber-100 hover:bg-amber-200 border-amber-200" 
            onClick={handleGenerateMockData}
          >
            إنشاء بيانات تجريبية
          </Button>
          <Button 
            variant="outline" 
            className="bg-red-100 hover:bg-red-200 border-red-200" 
            onClick={handleClearMockData}
          >
            مسح البيانات التجريبية
          </Button>
          <div className="flex-1 flex items-center text-amber-700 text-sm mr-2">
            ملاحظة: هذا الشريط للعرض التوضيحي فقط ويمكن إزالته عند استخدام البيانات الفعلية
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-between items-center">
              <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-2">
                <TabsTrigger value="daily">التقرير اليومي</TabsTrigger>
                <TabsTrigger value="comparative" className="flex items-center gap-1">
                  {!isAuthenticated && <LockKeyhole size={14} />}
                  التحليل المقارن
                </TabsTrigger>
              </TabsList>
              
              {isAuthenticated && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 text-gray-500"
                  onClick={handleSignOut}
                >
                  <Unlock size={14} />
                  تسجيل الخروج
                </Button>
              )}
            </div>

            <Card className="mt-4">
              <CardContent className="pt-6">
                <TabsContent value="daily" className="mt-0">
                  <DailySalesReport />
                </TabsContent>

                <TabsContent value="comparative" className="mt-0">
                  {isAuthenticated ? (
                    <ComparativeAnalysis />
                  ) : (
                    <div className="py-12 text-center">
                      <LockKeyhole className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">
                        هذا القسم محمي بكلمة مرور
                      </h3>
                      <p className="text-gray-500 mb-4">
                        يرجى تسجيل الدخول للوصول إلى التحليل المقارن
                      </p>
                      <Button 
                        onClick={() => setPasswordDialogOpen(true)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        تسجيل الدخول
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
        
        {/* Password Dialog */}
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>تسجيل الدخول إلى التحليل المقارن</DialogTitle>
              <DialogDescription>
                يرجى إدخال كلمة المرور للوصول إلى تقارير التحليل المقارن
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="relative">
                <Label htmlFor="password" className="mb-2 block">
                  كلمة المرور
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
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                variant="link"
                onClick={() => {
                  setPasswordDialogOpen(false);
                  setResetDialogOpen(true);
                }}
              >
                نسيت كلمة المرور؟
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handlePasswordSubmit}>
                  تسجيل الدخول
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Reset Password Dialog */}
        <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>استعادة كلمة المرور</AlertDialogTitle>
              <AlertDialogDescription>
                يرجى الإجابة على سؤال الأمان أو إدخال رمز الاسترداد
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
                  placeholder="أدخل إجابتك هنا"
                />
              </div>
              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">أو</span>
                </div>
              </div>
              <div>
                <Label htmlFor="resetCode" className="mb-2 block">
                  رمز الاسترداد
                </Label>
                <Input
                  id="resetCode"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="أدخل رمز الاسترداد"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetSubmit}>
                استعادة
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default ReportPage;
