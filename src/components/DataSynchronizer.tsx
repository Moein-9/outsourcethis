
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useInventoryStore } from '@/store/inventoryStore';
import { usePatientStore } from '@/store/patientStore';
import { useInvoiceStore } from '@/store/invoiceStore';
import { 
  syncPatientsToSupabase,
  syncInvoicesToSupabase,
  syncWorkOrdersToSupabase,
  syncRefundsToSupabase,
  syncFramesToSupabase,
  syncLensTypesToSupabase,
  syncLensCoatingsToSupabase,
  syncLensThicknessesToSupabase,
  syncLensPricingCombinationsToSupabase,
  syncContactLensesToSupabase,
  syncServicesToSupabase,
  syncPatientRxToSupabase,
  syncPatientNotesToSupabase,
  syncContactLensRxToSupabase
} from '@/integrations/supabase/client';

export const DataSynchronizer: React.FC = () => {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Ready to sync');
  const [results, setResults] = useState<Record<string, { count: number, error: any }>>({});
  
  // Get data from local stores
  const frames = useInventoryStore(state => state.frames);
  const lensTypes = useInventoryStore(state => state.lensTypes);
  const lensCoatings = useInventoryStore(state => state.lensCoatings);
  const lensThicknesses = useInventoryStore(state => state.lensThicknesses);
  const contactLenses = useInventoryStore(state => state.contactLenses);
  const services = useInventoryStore(state => state.services);
  const lensPricingCombinations = useInventoryStore(state => state.lensPricingCombinations);
  
  const patients = usePatientStore(state => state.patients);
  
  const invoices = useInvoiceStore(state => state.invoices);
  const workOrders = useInvoiceStore(state => state.workOrders);
  const refunds = useInvoiceStore(state => state.refunds);
  
  const handleSync = async () => {
    if (syncing) return;
    
    try {
      setSyncing(true);
      setProgress(0);
      setStatusMessage('Starting synchronization...');
      setResults({});
      
      // Define sync steps for progress calculation
      const totalSteps = 14;
      let currentStep = 0;
      
      // Sync inventory data
      setStatusMessage('Syncing frames...');
      const framesResult = await syncFramesToSupabase(frames);
      setResults(prev => ({ ...prev, frames: framesResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      setStatusMessage('Syncing lens types...');
      const lensTypesResult = await syncLensTypesToSupabase(lensTypes);
      setResults(prev => ({ ...prev, lensTypes: lensTypesResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      setStatusMessage('Syncing lens coatings...');
      const lensCoatingsResult = await syncLensCoatingsToSupabase(lensCoatings);
      setResults(prev => ({ ...prev, lensCoatings: lensCoatingsResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      setStatusMessage('Syncing lens thicknesses...');
      const lensThicknessesResult = await syncLensThicknessesToSupabase(lensThicknesses);
      setResults(prev => ({ ...prev, lensThicknesses: lensThicknessesResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      setStatusMessage('Syncing lens pricing combinations...');
      const lensPricingResult = await syncLensPricingCombinationsToSupabase(lensPricingCombinations);
      setResults(prev => ({ ...prev, lensPricing: lensPricingResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      setStatusMessage('Syncing contact lenses...');
      const contactLensesResult = await syncContactLensesToSupabase(contactLenses);
      setResults(prev => ({ ...prev, contactLenses: contactLensesResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      setStatusMessage('Syncing services...');
      const servicesResult = await syncServicesToSupabase(services);
      setResults(prev => ({ ...prev, services: servicesResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      // Sync patient data
      setStatusMessage('Syncing patients...');
      const patientsResult = await syncPatientsToSupabase(patients);
      setResults(prev => ({ ...prev, patients: patientsResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      // Sync patient prescriptions and notes
      setStatusMessage('Syncing patient prescriptions...');
      let patientRxCount = 0;
      let patientNotesCount = 0;
      let contactLensRxCount = 0;
      
      for (const patient of patients) {
        if (patient.rxHistory && patient.rxHistory.length > 0) {
          const rxResult = await syncPatientRxToSupabase(patient.patientId, patient.rxHistory);
          patientRxCount += rxResult.count || 0;
        }
        
        if (patient.patientNotes && patient.patientNotes.length > 0) {
          const notesResult = await syncPatientNotesToSupabase(patient.patientId, patient.patientNotes);
          patientNotesCount += notesResult.count || 0;
        }
        
        if (patient.contactLensRxHistory && patient.contactLensRxHistory.length > 0) {
          const contactRxResult = await syncContactLensRxToSupabase(patient.patientId, patient.contactLensRxHistory);
          contactLensRxCount += contactRxResult.count || 0;
        }
      }
      
      setResults(prev => ({ 
        ...prev, 
        patientRx: { count: patientRxCount, error: null },
        patientNotes: { count: patientNotesCount, error: null },
        contactLensRx: { count: contactLensRxCount, error: null }
      }));
      
      setProgress(++currentStep / totalSteps * 100);
      
      // Sync transaction data
      setStatusMessage('Syncing invoices...');
      const invoicesResult = await syncInvoicesToSupabase(invoices);
      setResults(prev => ({ ...prev, invoices: invoicesResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      setStatusMessage('Syncing work orders...');
      const workOrdersResult = await syncWorkOrdersToSupabase(workOrders);
      setResults(prev => ({ ...prev, workOrders: workOrdersResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      setStatusMessage('Syncing refunds...');
      const refundsResult = await syncRefundsToSupabase(refunds);
      setResults(prev => ({ ...prev, refunds: refundsResult }));
      setProgress(++currentStep / totalSteps * 100);
      
      // Complete
      setProgress(100);
      setStatusMessage('Synchronization completed!');
      
      toast({
        title: "Data Synchronization Complete",
        description: "All local data has been synchronized to Supabase.",
      });
    } catch (error) {
      console.error('Synchronization error:', error);
      setStatusMessage(`Error: ${error.message}`);
      toast({
        title: "Synchronization Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSyncing(false);
    }
  };
  
  const formatResults = () => {
    if (Object.keys(results).length === 0) return null;
    
    return (
      <div className="mt-4 space-y-2 text-sm">
        <h3 className="font-medium">Synchronization Results:</h3>
        <ul className="space-y-1">
          {Object.entries(results).map(([key, result]) => (
            <li key={key} className="flex justify-between">
              <span>{key}:</span>
              <span className={result.error ? "text-red-500" : "text-green-500"}>
                {result.error ? `Error: ${result.error.message}` : `${result.count} records`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Data Synchronization</CardTitle>
        <CardDescription>
          Synchronize your local data to the Supabase database to enable reporting and backup.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>{statusMessage}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
        
        {formatResults()}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSync} 
          disabled={syncing}
          className="w-full"
        >
          {syncing ? 'Synchronizing...' : 'Synchronize Data to Supabase'}
        </Button>
      </CardFooter>
    </Card>
  );
};
