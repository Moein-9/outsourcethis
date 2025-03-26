
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePatientStore } from '@/store/patientStore';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { PatientNotes } from '@/components/PatientNotes';

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
  const [tempPatientId, setTempPatientId] = useState<string | null>(null);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      phone: '',
      dob: '',
      notes: '',
    },
  });

  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create empty RX data
      const emptyRx = {
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
      };
      
      // Add patient with notes
      const patientId = addPatient({
        name: data.name,
        phone: data.phone,
        dob: data.dob,
        notes: data.notes || '', // Include the notes from the form
        rx: emptyRx,
      });
      
      toast.success(language === 'ar' ? 'تمت إضافة المريض بنجاح' : 'Patient added successfully');
      
      // Set the temporary patient ID for notes
      setTempPatientId(patientId);
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error(language === 'ar' ? 'حدث خطأ أثناء إضافة المريض' : 'Error adding patient');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
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
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4" />
                      {language === 'ar' ? 'ملاحظة أولية' : 'Initial Note'}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={language === 'ar' 
                          ? 'أضف ملاحظة أولية عن المريض هنا...' 
                          : 'Add an initial note about the patient here...'
                        }
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {language === 'ar' 
                        ? 'هذه الملاحظة الأولية ستظهر في سجل ملاحظات المريض أدناه.' 
                        : 'This initial note will appear in the patient notes record below.'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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

      {tempPatientId ? (
        <div className="mt-8">
          <PatientNotes patientId={tempPatientId} />
        </div>
      ) : (
        <Card className="mt-8">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t("patientNotes")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <MessageSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium">{language === 'ar' ? 'أضف المريض أولاً' : 'Add patient first'}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'ar' 
                  ? 'بعد إضافة المريض، يمكنك إضافة ملاحظات متعددة هنا.'
                  : 'After adding the patient, you can add multiple notes here.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
