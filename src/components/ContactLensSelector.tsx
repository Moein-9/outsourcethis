
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Contact, Eye } from "lucide-react";

interface ContactLensItem {
  id: string;
  brand: string;
  type: string;
  bc: string; // Base curve
  diameter: string;
  power: string;
  price: number;
  qty: number;
}

interface ContactLensSelection {
  rightEye: ContactLensItem | null;
  leftEye: ContactLensItem | null;
  sameForBoth: boolean;
}

interface ContactLensSelectorProps {
  onSelect: (selection: Contact) => void;
}

const mockContactLenses: ContactLensItem[] = [
  {
    id: "cl1",
    brand: "Acuvue",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 25,
    qty: 30
  },
  // Add more mock data as needed
];

export const ContactLensSelector: React.FC<ContactLensSelectorProps> = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ContactLensItem[]>([]);
  const [selection, setSelection] = useState<ContactLensSelection>({
    rightEye: null,
    leftEye: null,
    sameForBoth: false
  });

  const handleSearch = () => {
    const filtered = mockContactLenses.filter(lens => 
      lens.brand.toLowerCase().includes(search.toLowerCase()) ||
      lens.type.toLowerCase().includes(search.toLowerCase()) ||
      lens.power.includes(search)
    );
    setResults(filtered);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Contact className="w-6 h-6 text-primary" />
        <h3 className="text-lg font-semibold">العدسات اللاصقة</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Eye Section */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5" />
            <h4 className="font-medium">العين اليسرى (OS)</h4>
          </div>
          <div className="space-y-3">
            <div>
              <Label>Power:</Label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">اختر القوة</option>
                {Array.from({ length: 41 }, (_, i) => i - 20).map(power => (
                  <option key={power} value={power}>{power.toFixed(2)}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Base Curve:</Label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">BC اختر</option>
                <option value="8.4">8.4</option>
                <option value="8.6">8.6</option>
                <option value="8.8">8.8</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Eye Section */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5" />
            <h4 className="font-medium">العين اليمنى (OD)</h4>
          </div>
          <div className="space-y-3">
            <div>
              <Label>Power:</Label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">اختر القوة</option>
                {Array.from({ length: 41 }, (_, i) => i - 20).map(power => (
                  <option key={power} value={power}>{power.toFixed(2)}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Base Curve:</Label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">BC اختر</option>
                <option value="8.4">8.4</option>
                <option value="8.6">8.6</option>
                <option value="8.8">8.8</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="ابحث عن العدسات اللاصقة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}>بحث</Button>
        </div>

        {results.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-2 text-right">Brand</th>
                  <th className="p-2 text-right">Type</th>
                  <th className="p-2 text-right">BC</th>
                  <th className="p-2 text-right">Diameter</th>
                  <th className="p-2 text-right">Power</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {results.map((lens) => (
                  <tr key={lens.id} className="hover:bg-muted/50">
                    <td className="p-2">{lens.brand}</td>
                    <td className="p-2">{lens.type}</td>
                    <td className="p-2">{lens.bc}</td>
                    <td className="p-2">{lens.diameter}</td>
                    <td className="p-2">{lens.power}</td>
                    <td className="p-2">{lens.price} KWD</td>
                    <td className="p-2">{lens.qty}</td>
                    <td className="p-2">
                      <Button variant="outline" size="sm">اختر</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
