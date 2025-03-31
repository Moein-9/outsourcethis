
import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { useInvoiceStore, Invoice } from '@/store/invoiceStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns';
import { CalendarIcon, CalendarCheck, Glasses, Contact, Tag, Edit, MoreVertical, Printer, ClipboardList, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from '@/lib/utils';

interface PatientTransactionHistoryProps {
  patient: {
    patientId: string;
    name: string;
  };
  onMarkAsPickedUp: (invoiceId: string) => void;
  onEdit: (invoice: Invoice) => void;
  shouldRefresh: boolean;
  onOrderClick?: (invoice: Invoice) => void;
}

export const PatientTransactionHistory: React.FC<PatientTransactionHistoryProps> = ({ 
  patient, 
  onMarkAsPickedUp, 
  onEdit, 
  shouldRefresh, 
  onOrderClick
}) => {
  const { t } = useLanguageStore();
  const { invoices } = useInvoiceStore();
  const [activeTab, setActiveTab] = useState<"pending" | "completed" | "archived" | "refunded">("pending");
  
  useEffect(() => {
    if (shouldRefresh) {
      // Trigger a refresh by changing the active tab temporarily
      const originalTab = activeTab;
      setActiveTab(originalTab === "pending" ? "completed" : "pending");
      setTimeout(() => setActiveTab(originalTab), 0);
    }
  }, [shouldRefresh, activeTab]);
  
  const formatDate = (dateString: string) => {
    try {
      return dateString ? format(new Date(dateString), "dd/MM/yyyy") : "-";
    } catch (error) {
      return "-";
    }
  };
  
  const pendingInvoices = invoices.filter(invoice => 
    invoice.patientId === patient.patientId && !invoice.isPaid && !invoice.isPickedUp
  );
  
  const completedInvoices = invoices.filter(invoice => 
    invoice.patientId === patient.patientId && invoice.isPickedUp
  );
  
  const archivedInvoices = invoices.filter(invoice => 
    invoice.patientId === patient.patientId && invoice.isPaid && invoice.isPickedUp
  );
  
  // Filter invoices with refunds property that exists and has elements
  const refundedInvoices = invoices.filter(invoice => 
    invoice.patientId === patient.patientId && 
    invoice.hasRefunds === true
  );

  // Helper function to render lens type safely
  const renderLensType = (lensType: any) => {
    if (typeof lensType === 'string') {
      return lensType;
    }
    if (lensType && typeof lensType === 'object') {
      return lensType.name || '-';
    }
    return '-';
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Pending Orders Tab */}
      <TabsContent value="pending" className="mt-0">
        <h3 className="text-xl font-semibold mb-4">{t('pendingOrders')}</h3>
        
        {pendingInvoices.length > 0 ? (
          <div className="space-y-4">
            {pendingInvoices.map((invoice) => (
              <Card 
                key={invoice.invoiceId} 
                className={`overflow-hidden cursor-pointer hover:shadow-md transition-all ${
                  invoice.isPickedUp ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30'
                }`}
                onClick={() => onOrderClick && onOrderClick(invoice)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center">
                        {invoice.invoiceType === 'contacts' ? (
                          <Contact size={16} className="mr-1" />
                        ) : (
                          <Glasses size={16} className="mr-1" />
                        )}
                        {t('invoiceNumber')}: {invoice.invoiceId.slice(-6)}
                      </CardTitle>
                      <CardDescription>
                        {t('workOrderNumber')}: {invoice.workOrderId ? invoice.workOrderId.slice(-6) : '-'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Badge className={`${invoice.isPaid ? 'bg-green-500' : 'bg-amber-500'} mr-2`}>
                        {invoice.isPaid ? t('paid') : t('unpaid')}
                      </Badge>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {formatCurrency(invoice.total)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon size={14} className="mr-1" />
                      {formatDate(invoice.createdAt)}
                    </div>
                    <div className="flex items-center text-muted-foreground justify-end">
                      {!invoice.isPickedUp && (
                        <Badge variant="outline" className="border-amber-200 text-amber-700">
                          {t('notPickedUp')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                    <Tag size={14} />
                    {t('lens')}: {renderLensType(invoice.lensType)}
                  </div>
                </CardContent>
                
                <CardFooter className="p-2 bg-muted/20 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(invoice);
                    }}
                  >
                    <Edit size={14} className="mr-1" />
                    {t('edit')}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/print/invoice/${invoice.invoiceId}`, '_blank');
                      }}>
                        <Printer size={14} className="mr-2" />
                        {t('printInvoice')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/print/workorder/${invoice.invoiceId}`, '_blank');
                      }}>
                        <ClipboardList size={14} className="mr-2" />
                        {t('printWorkOrder')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsPickedUp(invoice.invoiceId);
                      }}>
                        <Check size={14} className="mr-2" />
                        {t('markAsPickedUp')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-muted/10 rounded-lg">
            <p className="text-muted-foreground">{t('noPendingOrders')}</p>
          </div>
        )}
      </TabsContent>

      {/* Completed Orders Tab */}
      <TabsContent value="completed" className="mt-0">
        <h3 className="text-xl font-semibold mb-4">{t('completedOrders')}</h3>
        
        {completedInvoices.length > 0 ? (
          <div className="space-y-4">
            {completedInvoices.map((invoice) => (
              <Card 
                key={invoice.invoiceId} 
                className="border-green-200 bg-green-50/30 overflow-hidden cursor-pointer hover:shadow-md transition-all"
                onClick={() => onOrderClick && onOrderClick(invoice)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center">
                        {invoice.invoiceType === 'contacts' ? (
                          <Contact size={16} className="mr-1" />
                        ) : (
                          <Glasses size={16} className="mr-1" />
                        )}
                        {t('invoiceNumber')}: {invoice.invoiceId.slice(-6)}
                      </CardTitle>
                      <CardDescription>
                        {t('workOrderNumber')}: {invoice.workOrderId ? invoice.workOrderId.slice(-6) : '-'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {invoice.hasEdits && (
                        <Badge variant="outline" className="border-amber-200 text-amber-700">
                          {t('edited')}
                        </Badge>
                      )}
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {formatCurrency(invoice.total)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon size={14} className="mr-1" />
                      {formatDate(invoice.createdAt)}
                    </div>
                    <div className="flex items-center text-muted-foreground justify-end">
                      <CalendarCheck size={14} className="mr-1" />
                      {formatDate(invoice.pickedUpAt || '')}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                    <Tag size={14} />
                    {t('lens')}: {renderLensType(invoice.lensType)}
                  </div>
                </CardContent>
                
                <CardFooter className="p-2 bg-muted/20 flex justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/print/invoice/${invoice.invoiceId}`, '_blank');
                      }}>
                        <Printer size={14} className="mr-2" />
                        {t('printInvoice')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/print/workorder/${invoice.invoiceId}`, '_blank');
                      }}>
                        <ClipboardList size={14} className="mr-2" />
                        {t('printWorkOrder')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-muted/10 rounded-lg">
            <p className="text-muted-foreground">{t('noCompletedOrders')}</p>
          </div>
        )}
      </TabsContent>
      
      {/* Archived Orders Tab */}
      <TabsContent value="archived" className="mt-0">
        <h3 className="text-xl font-semibold mb-4">{t('archived')} {t('workOrders')}</h3>
        
        {archivedInvoices.length > 0 ? (
          <div className="space-y-4">
            {archivedInvoices.map((invoice) => (
              <Card 
                key={invoice.invoiceId} 
                className="border-gray-200 bg-gray-50/30 overflow-hidden cursor-pointer hover:shadow-md transition-all"
                onClick={() => onOrderClick && onOrderClick(invoice)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center">
                        {invoice.invoiceType === 'contacts' ? (
                          <Contact size={16} className="mr-1" />
                        ) : (
                          <Glasses size={16} className="mr-1" />
                        )}
                        {t('invoiceNumber')}: {invoice.invoiceId.slice(-6)}
                      </CardTitle>
                      <CardDescription>
                        {t('workOrderNumber')}: {invoice.workOrderId ? invoice.workOrderId.slice(-6) : '-'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{t('archived')}</Badge>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {formatCurrency(invoice.total)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon size={14} className="mr-1" />
                      {formatDate(invoice.createdAt)}
                    </div>
                    <div className="flex items-center text-muted-foreground justify-end">
                      <CalendarCheck size={14} className="mr-1" />
                      {formatDate(invoice.pickedUpAt || '')}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                    <Tag size={14} />
                    {t('lens')}: {renderLensType(invoice.lensType)}
                  </div>
                </CardContent>
                
                <CardFooter className="p-2 bg-muted/20 flex justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/print/invoice/${invoice.invoiceId}`, '_blank');
                      }}>
                        <Printer size={14} className="mr-2" />
                        {t('printInvoice')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/print/workorder/${invoice.invoiceId}`, '_blank');
                      }}>
                        <ClipboardList size={14} className="mr-2" />
                        {t('printWorkOrder')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-muted/10 rounded-lg">
            <p className="text-muted-foreground">{t('noArchivedOrders')}</p>
          </div>
        )}
      </TabsContent>
      
      {/* Refunded Orders Tab */}
      <TabsContent value="refunded" className="mt-0">
        <h3 className="text-xl font-semibold mb-4">{t('refunded')} {t('transactions')}</h3>
        
        {refundedInvoices.length > 0 ? (
          <div className="space-y-4">
            {refundedInvoices.map((invoice) => (
              <Card 
                key={invoice.invoiceId} 
                className="border-red-200 bg-red-50/30 overflow-hidden cursor-pointer hover:shadow-md transition-all"
                onClick={() => onOrderClick && onOrderClick(invoice)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center">
                        {invoice.invoiceType === 'contacts' ? (
                          <Contact size={16} className="mr-1" />
                        ) : (
                          <Glasses size={16} className="mr-1" />
                        )}
                        {t('invoiceNumber')}: {invoice.invoiceId.slice(-6)}
                      </CardTitle>
                      <CardDescription>
                        {t('workOrderNumber')}: {invoice.workOrderId ? invoice.workOrderId.slice(-6) : '-'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{t('refunded')}</Badge>
                      <Badge variant="outline" className="border-blue-200 text-blue-700">
                        {formatCurrency(invoice.total)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon size={14} className="mr-1" />
                      {formatDate(invoice.createdAt)}
                    </div>
                    <div className="flex items-center text-muted-foreground justify-end">
                      <CalendarCheck size={14} className="mr-1" />
                      {formatDate(invoice.pickedUpAt || '')}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                    <Tag size={14} />
                    {t('lens')}: {renderLensType(invoice.lensType)}
                  </div>
                </CardContent>
                
                <CardFooter className="p-2 bg-muted/20 flex justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/print/invoice/${invoice.invoiceId}`, '_blank');
                      }}>
                        <Printer size={14} className="mr-2" />
                        {t('printInvoice')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/print/workorder/${invoice.invoiceId}`, '_blank');
                      }}>
                        <ClipboardList size={14} className="mr-2" />
                        {t('printWorkOrder')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-muted/10 rounded-lg">
            <p className="text-muted-foreground">{t('noRefundedTransactions')}</p>
          </div>
        )}
      </TabsContent>
    </div>
  );
};
