
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePatientStore } from '@/store/patientStore';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PrescriptionInput } from '@/components/ui/PrescriptionInput';

// Schema for patient creation
const patientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(8, { message: "Phone number must be at least 8 characters" }),
  dob: z.string(),
  notes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export const CreatePatientForm: React.FC = () => {
  const { addPatient } = usePatientStore();
  const { language, t } = useLanguageStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for prescription data
  const [sphereOD, setSphereOD] = useState("");
  const [cylOD, setCylOD] = useState("");
  const [axisOD, setAxisOD] = useState("");
  const [addOD, setAddOD] = useState("");
  const [sphereOS, setSphereOS] = useState("");
  const [cylOS, setCylOS] = useState("");
  const [axisOS, setAxisOS] = useState("");
  const [addOS, setAddOS] = useState("");
  const [pdRight, setPdRight] = useState("");
  const [pdLeft, setPdLeft] = useState("");
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    rightEye: { cylinderWithoutAxis: false },
    leftEye: { cylinderWithoutAxis: false }
  });
  
  // Validate CYL/AXIS pairing
  useEffect(() => {
    setValidationErrors({
      rightEye: { 
        cylinderWithoutAxis: cylOD !== "" && axisOD === "" 
      },
      leftEye: { 
        cylinderWithoutAxis: cylOS !== "" && axisOS === "" 
      }
    });
  }, [cylOD, axisOD, cylOS, axisOS]);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      phone: '',
      dob: '',
      notes: '',
    },
  });

  // Generate sphere options
  const generateSphereOptions = () => {
    const options = [];
    for (let i = 10; i >= -10; i -= 0.25) {
      const formatted = i >= 0 ? `+${i.toFixed(2)}` : i.toFixed(2);
      options.push({ value: formatted, label: formatted });
    }
    return options;
  };
  
  // Generate cylinder options
  const generateCylOptions = () => {
    const options = [];
    for (let i = 0; i >= -6; i -= 0.25) {
      const formatted = i.toFixed(2);
      options.push({ value: formatted, label: formatted });
    }
    return options;
  };
  
  // Generate axis options
  const generateAxisOptions = () => {
    const options = [];
    for (let i = 0; i <= 180; i += 1) {
      options.push({ value: i.toString(), label: i.toString() });
    }
    return options;
  };
  
  // Generate add options
  const generateAddOptions = () => {
    const options = [];
    for (let i = 0; i <= 3; i += 0.25) {
      const formatted = i === 0 ? "0.00" : `+${i.toFixed(2)}`;
      options.push({ value: formatted, label: formatted });
    }
    return options;
  };
  
  // Generate PD options (starting from 15.0 with 0.5 increments)
  const generatePdOptions = () => {
    const options = [];
    for (let i = 15.0; i <= 80.0; i += 0.5) {
      options.push({ value: i.toFixed(1), label: i.toFixed(1) });
    }
    return options;
  };

  const onSubmit = async (data: PatientFormValues) => {
    // Validate CYL/AXIS pairs
    if (validationErrors.rightEye.cylinderWithoutAxis || validationErrors.leftEye.cylinderWithoutAxis) {
      toast.error(t("cylAxisError"));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create RX data
      const rxData = {
        sphereOD,
        cylOD,
        axisOD,
        addOD,
        sphereOS,
        cylOS,
        axisOS,
        addOS,
        pdRight,
        pdLeft,
      };
      
      // Add patient with notes
      const patientId = addPatient({
        name: data.name,
        phone: data.phone,
        dob: data.dob,
        notes: data.notes || '', // Include the notes from the form
        rx: rxData,
      });
      
      toast.success(language === 'ar' ? 'تمت إضافة المريض بنجاح' : 'Patient added successfully');
      
      // Reset form
      form.reset();
      // Reset prescription fields
      setSphereOD("");
      setCylOD("");
      setAxisOD("");
      setAddOD("");
      setSphereOS("");
      setCylOS("");
      setAxisOS("");
      setAddOS("");
      setPdRight("");
      setPdLeft("");
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error(language === 'ar' ? 'حدث خطأ أثناء إضافة المريض' : 'Error adding patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{language === 'ar' ? 'إضافة مريض جديد' : 'Add New Patient'}</CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? 'أدخل بيانات المريض الأساسية. يمكنك إضافة الوصفة الطبية لاحقاً.'
            : 'Enter the basic patient information. You can add prescription details later.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={language === 'ar' ? 'اسم المريض' : 'Patient name'} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phoneNumber')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={language === 'ar' ? 'رقم الهاتف' : 'Phone number'} 
                      type="tel" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('dateOfBirth')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Prescription section with validation */}
            <div className="space-y-4 border p-4 rounded-md">
              <h3 className="text-lg font-medium">{t('prescription')}</h3>
              
              {/* Validation warnings */}
              {(validationErrors.rightEye.cylinderWithoutAxis || validationErrors.leftEye.cylinderWithoutAxis) && (
                <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">
                    {t("cylAxisError")}
                  </p>
                </div>
              )}
              
              {/* Right Eye */}
              <div>
                <h4 className="font-medium mb-2">{t('rightEye')} (OD)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>SPH</Label>
                    <PrescriptionInput
                      value={sphereOD}
                      onChange={setSphereOD}
                      options={generateSphereOptions()}
                      placeholder={t('choose')}
                    />
                  </div>
                  <div>
                    <Label>CYL</Label>
                    <PrescriptionInput
                      value={cylOD}
                      onChange={setCylOD}
                      options={generateCylOptions()}
                      placeholder={t('choose')}
                      isInvalid={validationErrors.rightEye.cylinderWithoutAxis}
                    />
                  </div>
                  <div>
                    <Label>AXIS</Label>
                    <PrescriptionInput
                      value={axisOD}
                      onChange={setAxisOD}
                      options={generateAxisOptions()}
                      placeholder={t('choose')}
                      isInvalid={validationErrors.rightEye.cylinderWithoutAxis}
                    />
                  </div>
                  <div>
                    <Label>ADD</Label>
                    <PrescriptionInput
                      value={addOD}
                      onChange={setAddOD}
                      options={generateAddOptions()}
                      placeholder={t('choose')}
                    />
                  </div>
                </div>
              </div>
              
              {/* Left Eye */}
              <div>
                <h4 className="font-medium mb-2">{t('leftEye')} (OS)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>SPH</Label>
                    <PrescriptionInput
                      value={sphereOS}
                      onChange={setSphereOS}
                      options={generateSphereOptions()}
                      placeholder={t('choose')}
                    />
                  </div>
                  <div>
                    <Label>CYL</Label>
                    <PrescriptionInput
                      value={cylOS}
                      onChange={setCylOS}
                      options={generateCylOptions()}
                      placeholder={t('choose')}
                      isInvalid={validationErrors.leftEye.cylinderWithoutAxis}
                    />
                  </div>
                  <div>
                    <Label>AXIS</Label>
                    <PrescriptionInput
                      value={axisOS}
                      onChange={setAxisOS}
                      options={generateAxisOptions()}
                      placeholder={t('choose')}
                      isInvalid={validationErrors.leftEye.cylinderWithoutAxis}
                    />
                  </div>
                  <div>
                    <Label>ADD</Label>
                    <PrescriptionInput
                      value={addOS}
                      onChange={setAddOS}
                      options={generateAddOptions()}
                      placeholder={t('choose')}
                    />
                  </div>
                </div>
              </div>
              
              {/* PD Values */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('rightPD')}</Label>
                  <PrescriptionInput
                    value={pdRight}
                    onChange={setPdRight}
                    options={generatePdOptions()}
                    placeholder={t('choose')}
                  />
                </div>
                <div>
                  <Label>{t('leftPD')}</Label>
                  <PrescriptionInput
                    value={pdLeft}
                    onChange={setPdLeft}
                    options={generatePdOptions()}
                    placeholder={t('choose')}
                  />
                </div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    {language === 'ar' ? 'ملاحظات' : 'Notes'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={language === 'ar' 
                        ? 'أضف ملاحظات عن المريض هنا...' 
                        : 'Add notes about the patient here...'
                      }
                      className="resize-none min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {language === 'ar' 
                      ? 'هذه الملاحظات ستظهر في سجل المريض وملف العميل.' 
                      : 'These notes will appear in the patient record and client profile.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || validationErrors.rightEye.cylinderWithoutAxis || validationErrors.leftEye.cylinderWithoutAxis}
            >
              {isSubmitting 
                ? (language === 'ar' ? 'جاري الإضافة...' : 'Adding...') 
                : (language === 'ar' ? 'إضافة المريض' : 'Add Patient')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
