
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Invoice, WorkOrder } from "@/store/invoiceStore";
import { TabbedTransactions } from "./TabbedTransactions";
import { Patient } from "@/store/patientStore";

interface PatientTransactionsProps {
  invoices: Invoice[];
  workOrders: WorkOrder[];
  patient?: Patient;
  onEditWorkOrder?: (workOrder: WorkOrder) => void;
}

export const PatientTransactions: React.FC<PatientTransactionsProps> = ({
  invoices,
  workOrders,
  patient,
  onEditWorkOrder
}) => {
  return (
    <TabbedTransactions
      invoices={invoices}
      workOrders={workOrders}
      patient={patient}
      onEditWorkOrder={onEditWorkOrder}
    />
  );
};
