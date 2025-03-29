
import React from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Edit, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PatientTransactionHistoryProps {
  invoices: any[];
  handleEditInvoice: (invoice: any) => void;
}

export const PatientTransactionHistory: React.FC<PatientTransactionHistoryProps> = ({ 
  invoices,
  handleEditInvoice
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  const completedInvoices = invoices.filter(invoice => invoice.isPaid && invoice.isPickedUp);
  const pendingInvoices = invoices.filter(invoice => !invoice.isPickedUp || !invoice.isPaid);
  
  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    const dateOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return {
      date: date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', dateOptions),
      time: date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', timeOptions)
    };
  };
  
  return (
    <Card className={`w-full mt-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{t('transactionHistory')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {t('pendingOrders')}
              {pendingInvoices.length > 0 && (
                <Badge variant="secondary" className="ml-2">{pendingInvoices.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {t('completedOrders')}
              {completedInvoices.length > 0 && (
                <Badge variant="secondary" className="ml-2">{completedInvoices.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-4">
            {pendingInvoices.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                {t('noPendingOrders')}
              </div>
            ) : (
              <div className="space-y-4">
                {pendingInvoices.map((invoice, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-lg">{t('invoiceNumber')}: {invoice.invoiceId}</h3>
                        {invoice.workOrderId && (
                          <p className="text-sm text-muted-foreground">
                            {t('workOrderNumber')}: {invoice.workOrderId}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(invoice.createdAt).date}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-lg">{invoice.total.toFixed(2)} {t('kwd')}</span>
                        <div className="flex mt-1">
                          {!invoice.isPaid && (
                            <Badge variant="destructive" className="mr-2">
                              {t('unpaid')}
                            </Badge>
                          )}
                          {!invoice.isPickedUp && (
                            <Badge variant="outline" className="border-amber-500 text-amber-600">
                              {t('notPickedUp')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {invoice.lensType && (
                        <Badge variant="secondary">
                          {t('lens')}: {invoice.lensType}
                        </Badge>
                      )}
                      {invoice.frameBrand && (
                        <Badge variant="secondary">
                          {t('frame')}: {invoice.frameBrand} {invoice.frameModel}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {t('edit')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            {completedInvoices.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                {t('noCompletedOrders')}
              </div>
            ) : (
              <div className="space-y-4">
                {completedInvoices.map((invoice, index) => {
                  const pickedUpTime = formatDateTime(invoice.pickedUpAt || '');
                  return (
                    <div 
                      key={index} 
                      className="border rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-lg">{t('invoiceNumber')}: {invoice.invoiceId}</h3>
                          {invoice.workOrderId && (
                            <p className="text-sm text-muted-foreground">
                              {t('workOrderNumber')}: {invoice.workOrderId}
                            </p>
                          )}
                          <div className="flex items-center mt-1 text-sm text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-green-600" />
                            <span>{pickedUpTime.date} - {pickedUpTime.time}</span>
                          </div>
                          
                          {invoice.editHistory && invoice.editHistory.length > 0 && (
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <div className="flex items-center mt-1 text-sm text-blue-600 cursor-pointer">
                                  <Clock className="w-3.5 h-3.5 mr-1" />
                                  <span>{t('edited')}</span>
                                </div>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">{t('editHistory')}</h4>
                                  <div className="text-xs space-y-1">
                                    {invoice.editHistory.map((edit: any, idx: number) => (
                                      <div key={idx} className="flex justify-between border-b pb-1">
                                        <span>{edit.notes}</span>
                                        <span className="text-muted-foreground">
                                          {formatDateTime(edit.timestamp).date} {formatDateTime(edit.timestamp).time}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-lg">{invoice.total.toFixed(2)} {t('kwd')}</span>
                          <Badge variant="success" className="mt-1 bg-green-100 text-green-800 hover:bg-green-200">
                            {t('completed')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {invoice.lensType && (
                          <Badge variant="secondary">
                            {t('lens')}: {invoice.lensType}
                          </Badge>
                        )}
                        {invoice.frameBrand && (
                          <Badge variant="secondary">
                            {t('frame')}: {invoice.frameBrand} {invoice.frameModel}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
