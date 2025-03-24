
import React from "react";
import { useLanguageStore } from "@/store/languageStore";

interface PrescriptionSectionProps {
  rx: any;
}

export const PrescriptionSection: React.FC<PrescriptionSectionProps> = ({
  rx,
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  if (!rx) return null;
  
  return (
    <div className="mb-3">
      <div className="text-center bg-black text-white py-1 mb-2 font-bold text-base rounded">
        {isRtl 
          ? "تفاصيل الوصفة الطبية | Prescription Details" 
          : "Prescription Details | تفاصيل الوصفة الطبية"}
      </div>
      
      <table className="w-full border-collapse text-xs" style={{ direction: 'ltr' }}>
        <thead>
          <tr className="bg-gray-100">
            <th className="p-1 border border-gray-300 text-center font-bold">Eye</th>
            <th className="p-1 border border-gray-300 text-center font-bold">SPH</th>
            <th className="p-1 border border-gray-300 text-center font-bold">CYL</th>
            <th className="p-1 border border-gray-300 text-center font-bold">AXIS</th>
            <th className="p-1 border border-gray-300 text-center font-bold">ADD</th>
            <th className="p-1 border border-gray-300 text-center font-bold">PD</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1 border border-gray-300 font-bold text-center bg-gray-100">OD</td>
            <td className="p-1 border border-gray-300 text-center">{rx.sphereOD || "—"}</td>
            <td className="p-1 border border-gray-300 text-center">{rx.cylOD || "—"}</td>
            <td className="p-1 border border-gray-300 text-center">{rx.axisOD || "—"}</td>
            <td className="p-1 border border-gray-300 text-center">{rx.addOD || rx.add || "—"}</td>
            <td className="p-1 border border-gray-300 text-center">{rx.pdRight || rx.pdOD || rx.pd || "—"}</td>
          </tr>
          <tr>
            <td className="p-1 border border-gray-300 font-bold text-center bg-gray-100">OS</td>
            <td className="p-1 border border-gray-300 text-center">{rx.sphereOS || "—"}</td>
            <td className="p-1 border border-gray-300 text-center">{rx.cylOS || "—"}</td>
            <td className="p-1 border border-gray-300 text-center">{rx.axisOS || "—"}</td>
            <td className="p-1 border border-gray-300 text-center">{rx.addOS || rx.add || "—"}</td>
            <td className="p-1 border border-gray-300 text-center">{rx.pdLeft || rx.pdOS || rx.pd || "—"}</td>
          </tr>
        </tbody>
      </table>
      
      <div className="mt-1 text-[9px] flex justify-between px-2 font-medium">
        <span>OD = {isRtl ? "العين اليمنى" : "Right Eye"}</span>
        <span>OS = {isRtl ? "العين اليسرى" : "Left Eye"}</span>
      </div>
    </div>
  );
};
