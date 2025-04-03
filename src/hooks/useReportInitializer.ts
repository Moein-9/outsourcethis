
import { useEffect, useState } from 'react';
import { useReportStore } from '@/store/reportStore';
import { useInvoiceStore } from '@/store/invoiceStore';
import { ReportingService } from '@/services/ReportingService';
import { toast } from 'sonner';

export const useReportInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializeReporting = useReportStore(state => state.initializeReporting);
  const isAlreadyInitialized = useReportStore(state => state.isInitialized);
  const isInitializing = useReportStore(state => state.isInitializing);
  
  // Subscribe to invoice store changes to sync with database
  const invoices = useInvoiceStore(state => state.invoices);
  const refunds = useInvoiceStore(state => state.refunds);
  
  useEffect(() => {
    if (!isAlreadyInitialized && !isInitializing && !isInitialized) {
      const initialize = async () => {
        try {
          await initializeReporting();
          setIsInitialized(true);
          toast.success("Reporting system initialized successfully");
        } catch (error) {
          console.error("Failed to initialize reporting system:", error);
          toast.error("Failed to initialize reporting system");
        }
      };
      
      initialize();
    }
  }, [isAlreadyInitialized, isInitializing, isInitialized, initializeReporting]);
  
  // Set up listener for new invoices and refunds
  useEffect(() => {
    // Add a listener to the invoice store to sync new invoices and refunds
    // In Zustand, the subscribe method expects a single callback that receives the state
    const unsubscribe = useInvoiceStore.subscribe(async (state) => {
      // Skip initial load
      if (!isInitialized) return;
      
      // Extract the data we need from state
      const newInvoices = state.invoices;
      const newRefunds = state.refunds;
      
      // Check if there are new invoices
      const lastInvoice = newInvoices[newInvoices.length - 1];
      if (lastInvoice && !invoices.some(i => i.invoiceId === lastInvoice.invoiceId)) {
        console.log("New invoice detected, syncing to database:", lastInvoice.invoiceId);
        await ReportingService.syncInvoiceToDatabase(lastInvoice);
        toast.success("Invoice synced to reporting system");
      }
      
      // Check if there are new refunds
      const lastRefund = newRefunds[newRefunds.length - 1];
      if (lastRefund && !refunds.some(r => r.refundId === lastRefund.refundId)) {
        console.log("New refund detected, syncing to database:", lastRefund.refundId);
        await ReportingService.syncRefundToDatabase(lastRefund);
        toast.success("Refund synced to reporting system");
      }
    });
    
    return () => unsubscribe();
  }, [isInitialized, invoices, refunds]);
  
  return { isInitialized, isInitializing: isInitializing };
};
