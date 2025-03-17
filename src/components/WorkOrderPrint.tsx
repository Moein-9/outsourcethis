
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { Eye, Ruler, CircleDot, ClipboardCheck, User, Glasses, BadgeCheck } from "lucide-react";

interface WorkOrderPrintProps {
  invoice: Invoice;
  patientName?: string;
  patientPhone?: string;
  rx?: any;
  lensType?: string;
  coating?: string;
  frame?: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
}

export const WorkOrderPrint: React.FC<WorkOrderPrintProps> = ({ 
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame
}) => {
  // Use either passed props or invoice data
  const name = patientName || invoice.patientName;
  const phone = patientPhone || invoice.patientPhone;
  const lensTypeValue = lensType || invoice.lensType;
  const coatingValue = coating || invoice.coating;
  const frameData = frame || (invoice.frameBrand ? {
    brand: invoice.frameBrand,
    model: invoice.frameModel,
    color: invoice.frameColor,
    size: "",
    price: invoice.framePrice
  } : undefined);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 border rounded-lg shadow-sm print:shadow-none">
      <div className="text-center border-b pb-4 mb-6 relative">
        <div className="absolute left-0 top-0">
          <ClipboardCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-1">Work Order</h1>
        <p className="text-lg text-primary font-medium">Order #: {invoice.invoiceId}</p>
        <p className="text-muted-foreground">
          {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-muted/10 p-4 rounded-lg border">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
            <User className="w-5 h-5" />
            Patient Information
          </h3>
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold w-20">Name:</span>
              <span>{name}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-20">Phone:</span>
              <span>{phone}</span>
            </div>
            {invoice.patientId && (
              <div className="flex">
                <span className="font-semibold w-20">ID:</span>
                <span>{invoice.patientId}</span>
              </div>
            )}
          </div>
        </div>

        {frameData && (
          <div className="bg-muted/10 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
              <Glasses className="w-5 h-5" />
              Frame Details
            </h3>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-20">Brand:</span>
                <span>{frameData.brand}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20">Model:</span>
                <span>{frameData.model}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20">Color:</span>
                <span>{frameData.color}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 bg-muted/10 p-4 rounded-lg border">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
          <Eye className="w-5 h-5" />
          Prescription Details
        </h3>
        <table className="w-full border-collapse bg-white">
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
              <td className="border p-2 text-center">{rx?.sphereOD || "_____"}</td>
              <td className="border p-2 text-center">{rx?.cylOD || "_____"}</td>
              <td className="border p-2 text-center">{rx?.axisOD || "_____"}</td>
              <td className="border p-2 text-center">{rx?.addOD || "_____"}</td>
              <td className="border p-2 text-center">{rx?.pdRight || "_____"}</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium">Left (OS)</td>
              <td className="border p-2 text-center">{rx?.sphereOS || "_____"}</td>
              <td className="border p-2 text-center">{rx?.cylOS || "_____"}</td>
              <td className="border p-2 text-center">{rx?.axisOS || "_____"}</td>
              <td className="border p-2 text-center">{rx?.addOS || "_____"}</td>
              <td className="border p-2 text-center">{rx?.pdLeft || "_____"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <div className="bg-muted/10 p-4 rounded-lg border">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
            <Ruler className="w-5 h-5" />
            Lens Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-20">Type:</span>
                <span>{lensTypeValue}</span>
              </div>
              {coatingValue && (
                <div className="flex">
                  <span className="font-semibold w-20">Coating:</span>
                  <span>{coatingValue}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-20">Price:</span>
                <span>{invoice.lensPrice.toFixed(2)} KWD</span>
              </div>
              {coatingValue && (
                <div className="flex">
                  <span className="font-semibold w-20">Coating:</span>
                  <span>{invoice.coatingPrice.toFixed(2)} KWD</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-muted/10 p-4 rounded-lg border">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
            <CircleDot className="w-5 h-5" />
            Additional Notes
          </h3>
          <div className="border rounded p-4 min-h-[100px] bg-white"></div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t grid grid-cols-2 gap-6">
        <div>
          <p className="font-semibold text-primary">Technician Signature</p>
          <div className="mt-6 border-b w-40 h-8"></div>
          <div className="mt-2 text-sm text-muted-foreground">Date: ___ / ___ / _____</div>
        </div>
        <div>
          <p className="font-semibold text-primary">Quality Check</p>
          <div className="flex items-center mt-6 gap-2">
            <BadgeCheck className="w-6 h-6 text-primary" />
            <div className="border-b w-32 h-8"></div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">Date: ___ / ___ / _____</div>
        </div>
      </div>
    </div>
  );
};
