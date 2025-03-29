
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, ReceiptText, Package, Truck, CheckCheck, XCircle } from "lucide-react";
import { Patient } from "@/store/patientStore";
import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { formatDate } from "@/lib/utils";
import { EditedBadge } from "./EditedBadge";

interface TabbedTransactionsProps {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  refundedInvoices?: Invoice[];
  patient?: Patient;
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
}

export const TabbedTransactions: React.FC<TabbedTransactionsProps> = ({
  invoices,
  workOrders,
  refundedInvoices = [],
  patient,
  onEditWorkOrder
}) => {
  const { t, language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('orders');
  
  const getLastEditNote = (editHistory?: Array<{timestamp: string, notes: string}>) => {
    if (!editHistory || editHistory.length === 0) return undefined;
    return editHistory[editHistory.length - 1].notes;
  };
  
  const renderLensType = (lensType: string | { name: string; price: number; } | undefined | null) => {
    if (!lensType) return '-';
    if (typeof lensType === 'string') return lensType;
    return lensType.name || '-';
  };
  
  return (
    <Card>
      <Tabs defaultValue="orders" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="data-[state=active]:font-medium">
              <Package className="w-4 h-4 mr-2" />
              {t('orders')}
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:font-medium">
              <ReceiptText className="w-4 h-4 mr-2" />
              {t('invoices')}
            </TabsTrigger>
            <TabsTrigger value="refunds" className="data-[state=active]:font-medium">
              <XCircle className="w-4 h-4 mr-2" />
              {t('refunds')}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="orders" className="mt-0">
          <CardContent className="p-4">
            {workOrders.length > 0 ? (
              <div className="overflow-auto max-h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('details')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead>{t('date')}</TableHead>
                      <TableHead className="text-right">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrders.map((workOrder) => (
                      <TableRow key={workOrder.id} className={workOrder.lastEditedAt ? "bg-amber-50/30" : ""}>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">#{workOrder.id}</span>
                              {workOrder.lastEditedAt && (
                                <EditedBadge 
                                  lastEditedAt={workOrder.lastEditedAt}
                                  editNotes={getLastEditNote(workOrder.editHistory)}
                                  size="sm"
                                />
                              )}
                            </div>
                            
                            <div className="text-sm text-gray-500">
                              {renderLensType(workOrder.lensType)}
                            </div>
                            
                            {workOrder.contactLenses && workOrder.contactLenses.length > 0 && (
                              <div className="text-sm text-gray-500">
                                {t('contactLenses')}: {workOrder.contactLenses.length} {t('items')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {workOrder.isPickedUp ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCheck className="w-3 h-3 mr-1" />
                              {t('pickedUp')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <Truck className="w-3 h-3 mr-1" />
                              {t('inProgress')}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDate(workOrder.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onEditWorkOrder && onEditWorkOrder(workOrder)}
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            {t('edit')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {t('noOrdersFound')}
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-0">
          <CardContent className="p-4">
            {invoices.length > 0 ? (
              <div className="overflow-auto max-h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('invoice')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead>{t('total')}</TableHead>
                      <TableHead>{t('date')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.invoiceId} className={invoice.lastEditedAt ? "bg-amber-50/30" : ""}>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">#{invoice.invoiceId}</span>
                              {invoice.lastEditedAt && (
                                <EditedBadge 
                                  lastEditedAt={invoice.lastEditedAt}
                                  editNotes={getLastEditNote(invoice.editHistory)}
                                  size="sm"
                                />
                              )}
                            </div>
                            
                            <div className="text-sm text-gray-500">
                              {renderLensType(invoice.lensType)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {invoice.isPaid ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {t('paid')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {t('unpaid')}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {invoice.total.toFixed(3)} {t('kwd')}
                        </TableCell>
                        <TableCell>
                          {formatDate(invoice.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {t('noInvoicesFound')}
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="refunds" className="mt-0">
          <CardContent className="p-4">
            {refundedInvoices.length > 0 ? (
              <div className="overflow-auto max-h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('invoice')}</TableHead>
                      <TableHead>{t('refundAmount')}</TableHead>
                      <TableHead>{t('refundMethod')}</TableHead>
                      <TableHead>{t('refundDate')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refundedInvoices.map((invoice) => (
                      <TableRow key={invoice.invoiceId}>
                        <TableCell>
                          <div className="font-medium">#{invoice.invoiceId}</div>
                          <div className="text-sm text-gray-500">
                            {invoice.refundReason || t('refundProcessed')}
                          </div>
                        </TableCell>
                        <TableCell>
                          {invoice.refundAmount ? invoice.refundAmount.toFixed(3) : invoice.total.toFixed(3)} {t('kwd')}
                        </TableCell>
                        <TableCell>
                          {invoice.refundMethod || t('cash')}
                        </TableCell>
                        <TableCell>
                          {invoice.refundDate ? formatDate(invoice.refundDate) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {t('noRefundsFound')}
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
