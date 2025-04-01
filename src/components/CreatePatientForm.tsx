
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePatientStore } from '@/store/patientStore';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';
import { MessageSquare, Glasses, Eye } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Schema for patient creation
const patientSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(8, { message: "Phone number must be at least 8 characters" }),
  dob: z.string(),
  notes: z.string().optional(),
  // Optional RX fields
  sphereOD: z.string().optional(),
  cylOD: z.string().optional(),
  axisOD: z.string().optional(),
  addOD: z.string().optional(),
  sphereOS: z.string().optional(),
  cylOS: z.string().optional(),
  axisOS: z.string().optional(),
  addOS: z.string().optional(),
  pdRight: z.string().optional(),
  pdLeft: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

export const CreatePatientForm: React.FC = () => {
  const { addPatient } = usePatientStore();
  const { language, t } = useLanguageStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [hasAddValues, setHasAddValues] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      phone: '',
      dob: '',
      notes: '',
      sphereOD: '',
      cylOD: '',
      axisOD: '',
      addOD: '',
      sphereOS: '',
      cylOS: '',
      axisOS: '',
      addOS: '',
      pdRight: '',
      pdLeft: '',
    },
  });

  // Watch ADD values to determine if Progressive/Bifocal options should be available
  const addOD = form.watch('addOD');
  const addOS = form.watch('addOS');

  // Update hasAddValues state whenever ADD values change
  useEffect(() => {
    const hasAdd = Boolean(
      (addOD && addOD !== '0' && addOD !== '0.00') || 
      (addOS && addOS !== '0' && addOS !== '0.00')
    );
    setHasAddValues(hasAdd);
  }, [addOD, addOS]);

  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create RX data from form
      const rxData = {
        sphereOD: data.sphereOD || '',
        cylOD: data.cylOD || '',
        axisOD: data.axisOD || '',
        addOD: data.addOD || '',
        sphereOS: data.sphereOS || '',
        cylOS: data.cylOS || '',
        axisOS: data.axisOS || '',
        addOS: data.addOS || '',
        pdRight: data.pdRight || '',
        pdLeft: data.pdLeft || '',
      };
      
      // Add patient with notes and rx
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
      setActiveTab('basic');
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error(language === 'ar' ? 'حدث خطأ أثناء إضافة المريض' : 'Error adding patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate values for dropdowns
  const generateSphValues = () => {
    const values = [];
    for (let i = -30; i <= 20; i += 0.25) {
      values.push(i.toFixed(2));
    }
    return values;
  };

  const generateCylValues = () => {
    const values = [];
    for (let i = -10; i <= 0; i += 0.25) {
      values.push(i.toFixed(2));
    }
    return values;
  };

  const generateAxisValues = () => {
    const values = [];
    for (let i = 0; i <= 180; i += 1) {
      values.push(i.toString());
    }
    return values;
  };

  const generateAddValues = () => {
    const values = [""];
    for (let i = 0.75; i <= 4; i += 0.25) {
      values.push(i.toFixed(2));
    }
    return values;
  };

  const generatePdValues = () => {
    const values = [""];
    for (let i = 15; i <= 60; i += 1) {
      values.push(i.toString());
    }
    return values;
  };

  const sphValues = generateSphValues();
  const cylValues = generateCylValues();
  const axisValues = generateAxisValues();
  const addValues = generateAddValues();
  const pdValues = generatePdValues();

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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
                  {language === 'ar' ? 'البيانات الأساسية' : 'Basic Info'}
                </TabsTrigger>
                <TabsTrigger value="prescription" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-800">
                  {language === 'ar' ? 'وصفة النظارات' : 'Eyeglass Prescription'}
                </TabsTrigger>
              </TabsList>
              
              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4 pt-4">
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
              </TabsContent>
              
              {/* Prescription Tab */}
              <TabsContent value="prescription" className="space-y-4 pt-4">
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <h3 className="text-sm font-medium text-indigo-800 mb-2 flex items-center gap-2">
                    <Glasses className="h-4 w-4 text-indigo-600" />
                    {language === 'ar' ? 'وصفة النظارات (اختياري)' : 'Eyeglass Prescription (Optional)'}
                  </h3>
                  <p className="text-xs text-indigo-700 mb-4">
                    {language === 'ar' 
                      ? 'إذا كان لديك وصفة النظارات الآن، يمكنك إدخالها. أو يمكنك إضافتها لاحقًا.' 
                      : 'If you have the prescription now, you can add it. Or you can add it later.'}
                  </p>
                  
                  {/* Prescription Table */}
                  <div className="overflow-x-auto bg-white border border-indigo-100 rounded-lg shadow-sm mb-2">
                    <table className="w-full text-sm ltr compact-table">
                      <thead className="bg-indigo-600 text-white">
                        <tr>
                          <th className="p-2 text-left font-medium"></th>
                          <th className="p-2 text-left font-medium">SPH</th>
                          <th className="p-2 text-left font-medium">CYL</th>
                          <th className="p-2 text-left font-medium">AXIS</th>
                          <th className="p-2 text-left font-medium">ADD</th>
                          <th className="p-2 text-left font-medium">PD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Right Eye (OD) Row */}
                        <tr className="border-b border-indigo-100 bg-indigo-50/50">
                          <td className="p-2 font-medium text-indigo-800 flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5 text-indigo-600" />
                            {language === 'ar' ? 'العين اليمنى (OD)' : 'Right Eye (OD)'}
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name="sphereOD"
                              render={({ field }) => (
                                <FormControl>
                                  <select
                                    className="w-full h-8 text-xs rounded border border-indigo-200 bg-white px-2 ltr"
                                    value={field.value}
                                    onChange={field.onChange}
                                    dir="ltr"
                                  >
                                    <option value="">-</option>
                                    {sphValues.map((val) => (
                                      <option key={`sph-od-${val}`} value={val}>{val}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name="cylOD"
                              render={({ field }) => (
                                <FormControl>
                                  <select
                                    className="w-full h-8 text-xs rounded border border-indigo-200 bg-white px-2 ltr"
                                    value={field.value}
                                    onChange={field.onChange}
                                    dir="ltr"
                                  >
                                    <option value="">-</option>
                                    {cylValues.map((val) => (
                                      <option key={`cyl-od-${val}`} value={val}>{val}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name="axisOD"
                              render={({ field }) => (
                                <FormControl>
                                  <select
                                    className="w-full h-8 text-xs rounded border border-indigo-200 bg-white px-2 ltr"
                                    value={field.value}
                                    onChange={field.onChange}
                                    dir="ltr"
                                  >
                                    <option value="">-</option>
                                    {axisValues.map((val) => (
                                      <option key={`axis-od-${val}`} value={val}>{val}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name="addOD"
                              render={({ field }) => (
                                <FormControl>
                                  <select
                                    className="w-full h-8 text-xs rounded border border-indigo-200 bg-white px-2 ltr"
                                    value={field.value}
                                    onChange={field.onChange}
                                    dir="ltr"
                                  >
                                    <option value="">-</option>
                                    {addValues.map((val) => (
                                      <option key={`add-od-${val}`} value={val || '-'}>{val || '-'}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name="pdRight"
                              render={({ field }) => (
                                <FormControl>
                                  <select
                                    className="w-full h-8 text-xs rounded border border-indigo-200 bg-white px-2 ltr"
                                    value={field.value}
                                    onChange={field.onChange}
                                    dir="ltr"
                                  >
                                    <option value="">-</option>
                                    {pdValues.map((val) => (
                                      <option key={`pd-right-${val}`} value={val}>{val}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              )}
                            />
                          </td>
                        </tr>
                        
                        {/* Left Eye (OS) Row */}
                        <tr className="bg-purple-50/50">
                          <td className="p-2 font-medium text-purple-800 flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5 text-purple-600" />
                            {language === 'ar' ? 'العين اليسرى (OS)' : 'Left Eye (OS)'}
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name="sphereOS"
                              render={({ field }) => (
                                <FormControl>
                                  <select
                                    className="w-full h-8 text-xs rounded border border-purple-200 bg-white px-2 ltr"
                                    value={field.value}
                                    onChange={field.onChange}
                                    dir="ltr"
                                  >
                                    <option value="">-</option>
                                    {sphValues.map((val) => (
                                      <option key={`sph-os-${val}`} value={val}>{val}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name="cylOS"
                              render={({ field }) => (
                                <FormControl>
                                  <select
                                    className="w-full h-8 text-xs rounded border border-purple-200 bg-white px-2 ltr"
                                    value={field.value}
                                    onChange={field.onChange}
                                    dir="ltr"
                                  >
                                    <option value="">-</option>
                                    {cylValues.map((val) => (
                                      <option key={`cyl-os-${val}`} value={val}>{val}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name="axisOS"
                              render={({ field }) => (
                                <FormControl>
                                  <select
                                    className="w-full h-8 text-xs rounded border border-purple-200 bg-white px-2 ltr"
                                    value={field.value}
                                    onChange={field.onChange}
                                    dir="ltr"
                                  >
                                    <option value="">-</option>
                                    {axisValues.map((val) => (
                                      <option key={`axis-os-${val}`} value={val}>{val}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name="addOS"
                              render={({ field }) => (
                                <FormControl>
                                  <select
                                    className="w-full h-8 text-xs rounded border border-purple-200 bg-white px-2 ltr"
                                    value={field.value}
                                    onChange={field.onChange}
                                    dir="ltr"
                                  >
                                    <option value="">-</option>
                                    {addValues.map((val) => (
                                      <option key={`add-os-${val}`} value={val || '-'}>{val || '-'}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <FormField
                              control={form.control}
                              name="pdLeft"
                              render={({ field }) => (
                                <FormControl>
                                  <select
                                    className="w-full h-8 text-xs rounded border border-purple-200 bg-white px-2 ltr"
                                    value={field.value}
                                    onChange={field.onChange}
                                    dir="ltr"
                                  >
                                    <option value="">-</option>
                                    {pdValues.map((val) => (
                                      <option key={`pd-left-${val}`} value={val}>{val}</option>
                                    ))}
                                  </select>
                                </FormControl>
                              )}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* ADD value indicator */}
                  <div className={`p-2 rounded-md text-xs mt-3 ${hasAddValues ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {hasAddValues 
                      ? (language === 'ar' ? '✓ قيم ADD متاحة - يمكن استخدام العدسات التقدمية والثنائية البؤرة' : '✓ ADD values available - Progressive and Bifocal lenses available')
                      : (language === 'ar' ? 'ℹ️ لا توجد قيم ADD - العدسات التقدمية والثنائية البؤرة غير متاحة' : 'ℹ️ No ADD values - Progressive and Bifocal lenses will not be available')}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
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
