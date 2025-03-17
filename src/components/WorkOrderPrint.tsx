
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { Eye, Ruler, CircleDot } from "lucide-react";

interface WorkOrderPrintProps {
  invoice: Invoice;
}

export const WorkOrderPrint: React.FC<WorkOrderPrintProps> = ({ invoice }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-6">
      <div className="text-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold mb-2">Work Order</h1>
        <p className="text-muted-foreground">Order #: {invoice.invoiceId}</p>
        <p className="text-muted-foreground">
          {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <CircleDot className="w-4 h-4" />
            Patient Information
          </h3>
          <div className="space-y-1">
            <p>Name: {invoice.patientName}</p>
            <p>Phone: {invoice.patientPhone}</p>
            {invoice.patientId && <p>ID: {invoice.patientId}</p>}
          </div>
        </div>

        {invoice.frameBrand && (
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Frame Details
            </h3>
            <div className="space-y-1">
              <p>Brand: {invoice.frameBrand}</p>
              <p>Model: {invoice.frameModel}</p>
              <p>Color: {invoice.frameColor}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Prescription Details
        </h3>
        <table className="w-full border-collapse">
          <thead className="bg-muted">
            <tr>
              <th className="border p-2 text-left">Eye</th>
              <th className="border p-2">SPH</th>
              <th className="border p-2">CYL</th>
              <th className="border p-2">AXIS</th>
              <th className="border p-2">ADD</th>
              <th className="border p-2">PD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2 font-medium">Right (OD)</td>
              <td className="border p-2 text-center">_____</td>
              <td className="border p-2 text-center">_____</td>
              <td className="border p-2 text-center">_____</td>
              <td className="border p-2 text-center">_____</td>
              <td className="border p-2 text-center">_____</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Left (OS)</td>
              <td className="border p-2 text-center">_____</td>
              <td className="border p-2 text-center">_____</td>
              <td className="border p-2 text-center">_____</td>
              <td className="border p-2 text-center">_____</td>
              <td className="border p-2 text-center">_____</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Lens Details</h3>
          <p>Type: {invoice.lensType}</p>
          {invoice.coating && <p>Coating: {invoice.coating}</p>}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Additional Notes</h3>
          <div className="border rounded p-4 min-h-[100px]"></div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Technician Signature</p>
            <div className="mt-2 border-b w-40"></div>
          </div>
          <div>
            <p className="font-semibold">Date</p>
            <div className="mt-2 border-b w-40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
