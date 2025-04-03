
import { create } from 'zustand';
import { ReportingService, DailySalesSummary, PaymentMethodSummary, InvoiceTypeSummary, InvoiceRecord, RefundRecord } from '@/services/ReportingService';
import { format, addDays, subDays, startOfMonth, endOfMonth, parse } from 'date-fns';
import { useInvoiceStore } from './invoiceStore';

interface ReportState {
  selectedDate: string;
  loading: boolean;
  error: string | null;
  dailySummary: DailySalesSummary | null;
  paymentMethods: PaymentMethodSummary[];
  invoiceTypes: InvoiceTypeSummary[];
  dailyInvoices: InvoiceRecord[];
  dailyRefunds: RefundRecord[];
  
  startDate: string;
  endDate: string;
  comparativeSummaries: DailySalesSummary[];
  comparativeLoading: boolean;
  
  // UI States
  isInitialized: boolean;
  isInitializing: boolean;
  
  // Actions
  setSelectedDate: (date: string) => void;
  previousDay: () => void;
  nextDay: () => void;
  loadDailyData: () => Promise<void>;
  setComparativeDateRange: (start: string, end: string) => void;
  loadComparativeData: () => Promise<void>;
  initializeReporting: () => Promise<void>;
}

const useReportStore = create<ReportState>((set, get) => ({
  selectedDate: format(new Date(), 'yyyy-MM-dd'),
  loading: false,
  error: null,
  dailySummary: null,
  paymentMethods: [],
  invoiceTypes: [],
  dailyInvoices: [],
  dailyRefunds: [],
  
  startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
  endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  comparativeSummaries: [],
  comparativeLoading: false,
  
  isInitialized: false,
  isInitializing: false,
  
  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
    get().loadDailyData();
  },
  
  previousDay: () => {
    const currentDate = parse(get().selectedDate, 'yyyy-MM-dd', new Date());
    const newDate = format(subDays(currentDate, 1), 'yyyy-MM-dd');
    set({ selectedDate: newDate });
    get().loadDailyData();
  },
  
  nextDay: () => {
    const currentDate = parse(get().selectedDate, 'yyyy-MM-dd', new Date());
    const newDate = format(addDays(currentDate, 1), 'yyyy-MM-dd');
    set({ selectedDate: newDate });
    get().loadDailyData();
  },
  
  loadDailyData: async () => {
    const { selectedDate } = get();
    set({ loading: true, error: null });
    
    try {
      // Get daily summary with details
      const { summary, paymentMethods, invoiceTypes } = 
        await ReportingService.getDailySummaryWithDetails(selectedDate);
      
      // Get invoices and refunds for the day
      const dailyInvoices = await ReportingService.getDailyInvoices(selectedDate);
      const dailyRefunds = await ReportingService.getDailyRefunds(selectedDate);
      
      set({ 
        dailySummary: summary, 
        paymentMethods, 
        invoiceTypes,
        dailyInvoices,
        dailyRefunds,
        loading: false 
      });
    } catch (error) {
      console.error('Error loading daily data:', error);
      set({ error: 'Failed to load daily report data', loading: false });
    }
  },
  
  setComparativeDateRange: (start: string, end: string) => {
    set({ startDate: start, endDate: end });
    get().loadComparativeData();
  },
  
  loadComparativeData: async () => {
    const { startDate, endDate } = get();
    set({ comparativeLoading: true, error: null });
    
    try {
      const comparativeSummaries = await ReportingService.getComparativeData(startDate, endDate);
      set({ comparativeSummaries, comparativeLoading: false });
    } catch (error) {
      console.error('Error loading comparative data:', error);
      set({ error: 'Failed to load comparative data', comparativeLoading: false });
    }
  },
  
  initializeReporting: async () => {
    const { isInitialized, isInitializing } = get();
    
    // Don't initialize if already initialized or in progress
    if (isInitialized || isInitializing) return;
    
    set({ isInitializing: true });
    
    try {
      // Get all invoices and refunds from the invoice store
      const invoiceStore = useInvoiceStore.getState();
      const invoices = invoiceStore.invoices;
      const refunds = invoiceStore.refunds;
      
      // Sync all invoices and refunds with the database
      await ReportingService.syncAllInvoicesAndRefunds(invoices, refunds);
      
      // Load daily data for the selected date
      await get().loadDailyData();
      
      // Load comparative data
      await get().loadComparativeData();
      
      set({ isInitialized: true, isInitializing: false });
    } catch (error) {
      console.error('Error initializing reporting:', error);
      set({ 
        error: 'Failed to initialize reporting system', 
        isInitializing: false 
      });
    }
  }
}));

export { useReportStore };
