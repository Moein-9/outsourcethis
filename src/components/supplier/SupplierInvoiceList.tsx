
import React, { useState, useEffect } from 'react';
import { useSupplierInvoiceStore, SupplierInvoice } from '@/store/supplierInvoiceStore';
import { useLanguageStore } from '@/store/languageStore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SupplierInvoiceDialog } from './SupplierInvoiceDialog';
import { Pencil, Trash2, Search } from 'lucide-react';
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
import { toast } from 'sonner';

export const SupplierInvoiceList: React.FC = () => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const invoices = useSupplierInvoiceStore(state => state.invoices);
  const deleteInvoice = useSupplierInvoiceStore(state => state.deleteInvoice);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState<SupplierInvoice[]>(invoices);
  const [editInvoice, setEditInvoice] = useState<SupplierInvoice | undefined>(undefined);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  const translations = {
    search: language === 'ar' ? 'بحث...' : 'Search...',
    companyName: language === 'ar' ? 'اسم الشركة' : 'Company Name',
    invoiceNumber: language === 'ar' ? 'رقم الفاتورة' : 'Invoice Number',
    invoiceAmount: language === 'ar' ? 'مبلغ الفاتورة' : 'Invoice Amount',
    invoiceDate: language === 'ar' ? 'تاريخ الفاتورة' : 'Invoice Date',
    actions: language === 'ar' ? 'إجراءات' : 'Actions',
    edit: language === 'ar' ? 'تعديل' : 'Edit',
    delete: language === 'ar' ? 'حذف' : 'Delete',
    noInvoices: language === 'ar' ? 'لا توجد فواتير' : 'No invoices found',
    confirmDelete: language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete',
    deleteConfirmMessage: language === 'ar' 
      ? 'هل أنت متأكد من رغبتك في حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء.' 
      : 'Are you sure you want to delete this invoice? This action cannot be undone.',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    confirmDeleteBtn: language === 'ar' ? 'حذف' : 'Delete',
    invoiceDeleted: language === 'ar' ? 'تم حذف الفاتورة بنجاح' : 'Invoice deleted successfully',
    currency: language === 'ar' ? 'د.ك' : 'KWD',
  };

  // Filter invoices based on search term
  useEffect(() => {
    const filtered = invoices.filter(invoice => 
      invoice.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(filtered);
  }, [invoices, searchTerm]);

  const handleEdit = (invoice: SupplierInvoice) => {
    setEditInvoice(invoice);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setInvoiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete);
      toast.success(translations.invoiceDeleted);
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-KW' : 'en-US');
  };

  return (
    <div>
      <div className="flex mb-4">
        <div className="relative w-full md:w-64">
          <Input
            placeholder={translations.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            dir={isRtl ? 'rtl' : 'ltr'}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {filteredInvoices.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRtl ? 'text-right' : ''}>{translations.companyName}</TableHead>
                <TableHead className={isRtl ? 'text-right' : ''}>{translations.invoiceNumber}</TableHead>
                <TableHead className={isRtl ? 'text-right' : ''}>{translations.invoiceDate}</TableHead>
                <TableHead className={isRtl ? 'text-right' : ''}>{translations.invoiceAmount}</TableHead>
                <TableHead className="text-center">{translations.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className={isRtl ? 'text-right' : ''}>
                    <div className="flex items-center gap-2">
                      <Badge
                        style={{ backgroundColor: invoice.color }}
                        className="w-3 h-3 rounded-full p-0"
                      />
                      {invoice.companyName}
                    </div>
                  </TableCell>
                  <TableCell className={isRtl ? 'text-right' : ''}>{invoice.invoiceNumber}</TableCell>
                  <TableCell className={isRtl ? 'text-right' : ''}>{formatDate(invoice.date)}</TableCell>
                  <TableCell className={isRtl ? 'text-right' : ''}>
                    {invoice.invoiceAmount.toFixed(3)} {translations.currency}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(invoice)}
                        title={translations.edit}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(invoice.id)}
                        title={translations.delete}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          {translations.noInvoices}
        </div>
      )}

      {/* Edit Dialog */}
      <SupplierInvoiceDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        editInvoice={editInvoice}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{translations.confirmDelete}</AlertDialogTitle>
            <AlertDialogDescription>
              {translations.deleteConfirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{translations.cancel}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {translations.confirmDeleteBtn}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
