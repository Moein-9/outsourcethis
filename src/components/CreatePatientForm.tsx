
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
