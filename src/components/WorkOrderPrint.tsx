
import React from "react";
import { format } from "date-fns";
import { Invoice } from "@/store/invoiceStore";
import { Eye, Ruler, CircleDot, ClipboardCheck, User, Glasses, BadgeCheck, Contact } from "lucide-react";
import { ContactLensItem } from "./ContactLensSelector";

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
  contactLenses?: ContactLensItem[];
  contactLensRx?: {
    rightEye: {
      sphere: string;
      cylinder: string;
      axis: string;
      bc: string;
      dia: string;
    };
    leftEye: {
      sphere: string;
      cylinder: string;
      axis: string;
      bc: string;
      dia: string;
    };
  };
}

export const WorkOrderPrint: React.FC<WorkOrderPrintProps> = ({ 
  invoice,
  patientName,
  patientPhone,
  rx,
  lensType,
  coating,
  frame,
  contactLenses,
  contactLensRx
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
  
  // Determine if this is a contact lens or glasses order
  const isContactLens = contactLenses && contactLenses.length > 0;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 border rounded-lg shadow-sm print:shadow-none">
      <div className="text-center border-b pb-4 mb-6 relative">
        <div className="absolute right-0 top-0">
          <ClipboardCheck className="w-10 h-10 text-primary" />
        </div>
        
        <div className="flex justify-center mb-3">
          <img 
            src="/lovable-uploads/fdd57e66-99f5-4953-a172-c48e0af3c3b8.png" 
            alt="Moen Optician" 
            className="h-16"
          />
        </div>
        
        <h1 className="text-2xl font-bold mb-1">أمر العمل - Moen Optician</h1>
        <p className="text-lg text-primary font-medium">رقم الطلب: {invoice.invoiceId}</p>
        <p className="text-muted-foreground">
          {format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm')}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          al-somait plaza, Habeeb Munawer St, Al Farwaniyah | هاتف: 2475 9016
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-muted/10 p-4 rounded-lg border">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
            <User className="w-5 h-5" />
            بيانات العميل
          </h3>
          <div className="space-y-2">
            <div className="flex">
              <span className="font-semibold w-20">الاسم:</span>
              <span>{name}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-20">الهاتف:</span>
              <span>{phone}</span>
            </div>
            {invoice.patientId && (
              <div className="flex">
                <span className="font-semibold w-20">رقم العميل:</span>
                <span>{invoice.patientId}</span>
              </div>
            )}
          </div>
        </div>

        {!isContactLens && frameData && (
          <div className="bg-muted/10 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
              <Glasses className="w-5 h-5" />
              تفاصيل الإطار
            </h3>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-20">الماركة:</span>
                <span>{frameData.brand}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20">الموديل:</span>
                <span>{frameData.model}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-20">اللون:</span>
                <span>{frameData.color}</span>
              </div>
            </div>
          </div>
        )}
        
        {isContactLens && (
          <div className="bg-muted/10 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
              <Contact className="w-5 h-5" />
              تفاصيل العدسات اللاصقة
            </h3>
            <div className="space-y-2">
              {contactLenses.map((lens, idx) => (
                <div key={idx} className="space-y-1 border-b pb-2 border-dashed border-gray-200 last:border-0">
                  <div className="flex">
                    <span className="font-semibold w-20">العدسة {idx + 1}:</span>
                    <span>{lens.brand} {lens.type}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-20">القوة:</span>
                    <span>{lens.power}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-20">BC:</span>
                    <span>{lens.bc}</span>
                  </div>
                  <div className="flex">
                    <span className="font-semibold w-20">Diameter:</span>
                    <span>{lens.diameter}</span>
                  </div>
                  {lens.color && (
                    <div className="flex">
                      <span className="font-semibold w-20">اللون:</span>
                      <span>{lens.color}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isContactLens && (
        <div className="mb-6 bg-muted/10 p-4 rounded-lg border">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
            <Eye className="w-5 h-5" />
            تفاصيل الوصفة الطبية
          </h3>
          <table className="w-full border-collapse bg-white">
            <thead className="bg-muted">
              <tr>
                <th className="border p-2 text-right">العين</th>
                <th className="border p-2">SPH</th>
                <th className="border p-2">CYL</th>
                <th className="border p-2">AXIS</th>
                <th className="border p-2">ADD</th>
                <th className="border p-2">PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-medium">اليمنى (OD)</td>
                <td className="border p-2 text-center">{rx?.sphereOD || "_____"}</td>
                <td className="border p-2 text-center">{rx?.cylOD || "_____"}</td>
                <td className="border p-2 text-center">{rx?.axisOD || "_____"}</td>
                <td className="border p-2 text-center">{rx?.addOD || "_____"}</td>
                <td className="border p-2 text-center">{rx?.pdRight || "_____"}</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">اليسرى (OS)</td>
                <td className="border p-2 text-center">{rx?.sphereOS || "_____"}</td>
                <td className="border p-2 text-center">{rx?.cylOS || "_____"}</td>
                <td className="border p-2 text-center">{rx?.axisOS || "_____"}</td>
                <td className="border p-2 text-center">{rx?.addOS || "_____"}</td>
                <td className="border p-2 text-center">{rx?.pdLeft || "_____"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {isContactLens && contactLensRx && (
        <div className="mb-6 bg-muted/10 p-4 rounded-lg border">
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
            <Eye className="w-5 h-5" />
            تفاصيل وصفة العدسات اللاصقة
          </h3>
          <table className="w-full border-collapse bg-white">
            <thead className="bg-muted">
              <tr>
                <th className="border p-2 text-right">العين</th>
                <th className="border p-2">Sphere</th>
                <th className="border p-2">Cylinder</th>
                <th className="border p-2">Axis</th>
                <th className="border p-2">BC</th>
                <th className="border p-2">Dia</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 font-medium">اليمنى (OD)</td>
                <td className="border p-2 text-center">{contactLensRx.rightEye.sphere || "_____"}</td>
                <td className="border p-2 text-center">{contactLensRx.rightEye.cylinder || "_____"}</td>
                <td className="border p-2 text-center">{contactLensRx.rightEye.axis || "_____"}</td>
                <td className="border p-2 text-center">{contactLensRx.rightEye.bc || "_____"}</td>
                <td className="border p-2 text-center">{contactLensRx.rightEye.dia || "_____"}</td>
              </tr>
              <tr>
                <td className="border p-2 font-medium">اليسرى (OS)</td>
                <td className="border p-2 text-center">{contactLensRx.leftEye.sphere || "_____"}</td>
                <td className="border p-2 text-center">{contactLensRx.leftEye.cylinder || "_____"}</td>
                <td className="border p-2 text-center">{contactLensRx.leftEye.axis || "_____"}</td>
                <td className="border p-2 text-center">{contactLensRx.leftEye.bc || "_____"}</td>
                <td className="border p-2 text-center">{contactLensRx.leftEye.dia || "_____"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {!isContactLens && (
        <div className="space-y-4">
          <div className="bg-muted/10 p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
              <Ruler className="w-5 h-5" />
              تفاصيل العدسات
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold w-20">النوع:</span>
                  <span>{lensTypeValue}</span>
                </div>
                {coatingValue && (
                  <div className="flex">
                    <span className="font-semibold w-20">الطلاء:</span>
                    <span>{coatingValue}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold w-20">السعر:</span>
                  <span>{invoice.lensPrice.toFixed(2)} د.ك</span>
                </div>
                {coatingValue && (
                  <div className="flex">
                    <span className="font-semibold w-20">سعر الطلاء:</span>
                    <span>{invoice.coatingPrice.toFixed(2)} د.ك</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-muted/10 p-4 rounded-lg border mt-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2 text-primary">
          <CircleDot className="w-5 h-5" />
          ملاحظات إضافية
        </h3>
        <div className="border rounded p-4 min-h-[100px] bg-white"></div>
      </div>

      <div className="mt-8 pt-4 border-t grid grid-cols-2 gap-6">
        <div>
          <p className="font-semibold text-primary">توقيع الفني</p>
          <div className="mt-6 border-b w-40 h-8"></div>
          <div className="mt-2 text-sm text-muted-foreground">التاريخ: ___ / ___ / _____</div>
        </div>
        <div>
          <p className="font-semibold text-primary">تأكيد الجودة</p>
          <div className="flex items-center mt-6 gap-2">
            <BadgeCheck className="w-6 h-6 text-primary" />
            <div className="border-b w-32 h-8"></div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">التاريخ: ___ / ___ / _____</div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground border-t pt-4">
        <p>Moen Optician | al-somait plaza, Habeeb Munawer St, Al Farwaniyah | Tel: 2475 9016</p>
      </div>
    </div>
  );
};
