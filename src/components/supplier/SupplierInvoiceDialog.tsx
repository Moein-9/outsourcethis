
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSupplierInvoiceStore, SupplierInvoice } from '@/store/supplierInvoiceStore';
import { useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';

interface SupplierInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editInvoice?: SupplierInvoice;
}

export const SupplierInvoiceDialog: React.FC<SupplierInvoiceDialogProps> = ({
  open,
  onOpenChange,
  editInvoice
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const addInvoice = useSupplierInvoiceStore(state => state.addInvoice);
  const updateInvoice = useSupplierInvoiceStore(state => state.updateInvoice);

  // Translations
  const translations = {
    addNewInvoice: language === 'ar' ? 'إضافة فاتورة موردين جديدة' : 'Add New Supplier Invoice',
    editInvoice: language === 'ar' ? 'تعديل فاتورة موردين' : 'Edit Supplier Invoice',
    companyName: language === 'ar' ? 'اسم الشركة' : 'Company Name',
    invoiceNumber: language === 'ar' ? 'رقم الفاتورة' : 'Invoice Number',
    invoiceAmount: language === 'ar' ? 'مبلغ الفاتورة' : 'Invoice Amount',
    invoiceDate: language === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date',
    save: language === 'ar' ? 'حفظ' : 'Save',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    required: language === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required',
    invalidAmount: language === 'ar' ? 'الرجاء إدخال مبلغ صحيح' : 'Please enter a valid amount',
    savedSuccess: language === 'ar' ? 'تم حفظ الفاتورة بنجاح' : 'Invoice saved successfully',
    updatedSuccess: language === 'ar' ? 'تم تحديث الفاتورة بنجاح' : 'Invoice updated successfully',
  };

  // Form schema
  const formSchema = z.object({
    companyName: z.string().min(1, { message: translations.required }),
    invoiceNumber: z.string().min(1, { message: translations.required }),
    invoiceAmount: z.string().min(1, { message: translations.required }),
    date: z.string().min(1, { message: translations.required }),
  });

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      invoiceNumber: '',
      invoiceAmount: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Load data for editing
  useEffect(() => {
    if (editInvoice && open) {
      form.reset({
        companyName: editInvoice.companyName,
        invoiceNumber: editInvoice.invoiceNumber,
        invoiceAmount: editInvoice.invoiceAmount.toString(),
        date: editInvoice.date,
      });
    } else if (open) {
      form.reset({
        companyName: '',
        invoiceNumber: '',
        invoiceAmount: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [editInvoice, open, form]);

  // Submit handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const invoiceData = {
      companyName: values.companyName,
      invoiceNumber: values.invoiceNumber,
      invoiceAmount: parseFloat(values.invoiceAmount),
      date: values.date,
    };

    if (editInvoice) {
      updateInvoice(editInvoice.id, invoiceData);
      toast.success(translations.updatedSuccess);
    } else {
      addInvoice(invoiceData);
      toast.success(translations.savedSuccess);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editInvoice ? translations.editInvoice : translations.addNewInvoice}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.companyName}</FormLabel>
                  <FormControl>
                    <Input {...field} dir={isRtl ? 'rtl' : 'ltr'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.invoiceNumber}</FormLabel>
                  <FormControl>
                    <Input {...field} dir={isRtl ? 'rtl' : 'ltr'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoiceAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.invoiceAmount}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      step="0.001"
                      min="0"
                      dir={isRtl ? 'rtl' : 'ltr'} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{translations.invoiceDate}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="date"
                      dir={isRtl ? 'rtl' : 'ltr'} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {translations.cancel}
              </Button>
              <Button type="submit">{translations.save}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
