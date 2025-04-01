import React, { useState, useEffect } from "react";
import { useInventoryStore, FrameItem, ContactLensItem } from "@/store/inventoryStore";
import { usePatientStore, ContactLensRx, Patient } from "@/store/patientStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Contact, Edit, Save, Check, Eye } from "lucide-react";
import { InputWithUnits } from "@/components/ui/input-with-units";
import { Textarea } from "@/components/ui/textarea";

interface WorkOrderEditFormProps {
  invoiceId?: string;
  onClose?: () => void;
}

export const WorkOrderEditForm: React.FC<WorkOrderEditFormProps> = ({ invoiceId, onClose }) => {
  const { frames, contactLenses } = useInventoryStore();
  const { patients } = usePatientStore();
  const { getInvoice, updateInvoice } = useInvoiceStore();
  const { t } = useLanguageStore();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [rx, setRx] = useState<{
    sphere?: { right: string; left: string };
    cylinder?: { right: string; left: string };
    axis?: { right: string; left: string };
    add?: { right: string; left: string };
    pd?: { right: string; left: string };
  }>({});
  const [contactLensRx, setContactLensRx] = useState<ContactLensRx | null>(null);
  const [lensType, setLensType] = useState("");
  const [coating, setCoating] = useState("");
  const [thickness, setThickness] = useState("");
  const [selectedFrame, setSelectedFrame] = useState<FrameItem | null>(null);
  const [contactLensItems, setContactLensItems] = useState<ContactLensItem[]>([]);
  const [notes, setNotes] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FrameItem[]>([]);

  const [isContactLensDialogOpen, setIsContactLensDialogOpen] = useState(false);
  const [contactLensSearchTerm, setContactLensSearchTerm] = useState("");
  const [contactLensSearchResults, setContactLensSearchResults] = useState<ContactLensItem[]>([]);

  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const brands = [...new Set(frames.map(frame => frame.brand))];
  const types = [...new Set(frames.map(frame => frame.type))];

  const [contactLensFilterBrand, setContactLensFilterBrand] = useState<string>("all");
  const [contactLensFilterType, setContactLensFilterType] = useState<string>("all");
  const contactLensBrands = [...new Set(contactLenses.map(lens => lens.brand))];
  const contactLensTypes = [...new Set(contactLenses.map(lens => lens.type))];

  useEffect(() => {
    if (invoiceId) {
      const invoice = getInvoice(invoiceId);
      if (invoice) {
        setPatient(patients.find(p => p.id === invoice.patientId) || null);
        setRx(invoice.rx || {});
        setContactLensRx(invoice.contactLensRx || null);
        setLensType(invoice.lensType || "");
        setCoating(invoice.coating || "");
        setThickness(invoice.thickness || "");
        setSelectedFrame(frames.find(f => f.frameId === invoice.frameId) || null);
        setContactLensItems(invoice.contactLensItems || []);
        setNotes(invoice.notes || "");
      }
    }
  }, [invoiceId, getInvoice, frames, patients]);

  const handleFrameSearch = () => {
    let results = frames;

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = frames.filter(frame =>
        frame.brand.toLowerCase().includes(lowercasedTerm) ||
        frame.model.toLowerCase().includes(lowercasedTerm) ||
        frame.color?.toLowerCase().includes(lowercasedTerm) ||
        frame.size?.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (filterBrand && filterBrand !== "all") {
      results = results.filter(frame => frame.brand === filterBrand);
    }

    if (filterType && filterType !== "all") {
      results = results.filter(frame => frame.type === filterType);
    }

    setSearchResults(results);
  };

  const handleContactLensSearch = () => {
    let results = contactLenses;

    if (contactLensSearchTerm) {
      const lowercasedTerm = contactLensSearchTerm.toLowerCase();
      results = contactLenses.filter(lens =>
        lens.brand.toLowerCase().includes(lowercasedTerm) ||
        lens.type.toLowerCase().includes(lowercasedTerm)
      );
    }

    if (contactLensFilterBrand && contactLensFilterBrand !== "all") {
      results = results.filter(lens => lens.brand === contactLensFilterBrand);
    }

    if (contactLensFilterType && contactLensFilterType !== "all") {
      results = results.filter(lens => lens.type === contactLensFilterType);
    }

    setContactLensSearchResults(results);
  };

  useEffect(() => {
    handleFrameSearch();
  }, [searchTerm, filterBrand, filterType, frames]);

  useEffect(() => {
    handleContactLensSearch();
  }, [contactLensSearchTerm, contactLensFilterBrand, contactLensFilterType, contactLenses]);

  const handleSelectFrame = (frame: FrameItem) => {
    setSelectedFrame(frame);
    setIsDialogOpen(false);
  };

  const handleSelectContactLens = (lens: ContactLensItem) => {
    setContactLensItems([...contactLensItems, lens]);
    setIsContactLensDialogOpen(false);
  };

  const handleRemoveContactLens = (lensId: string) => {
    setContactLensItems(contactLensItems.filter(lens => lens.id !== lensId));
  };

  const handleSave = () => {
    if (!invoiceId) {
      toast.error("Invoice ID is missing.");
      return;
    }

    updateInvoice(invoiceId, {
      patientId: patient?.id,
      rx,
      contactLensRx,
      lensType,
      coating,
      thickness,
      frameId: selectedFrame?.frameId,
      contactLensItems,
      notes
    });

    toast.success("Work order updated successfully!");
    onClose?.();
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{patient?.name}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InputWithUnits
            label="Sphere (Right)"
            value={rx.sphere?.right || ""}
            onChange={value => setRx(prev => ({ ...prev, sphere: { ...prev.sphere, right: value } }))}
            unit="diopter"
          />
          <InputWithUnits
            label="Sphere (Left)"
            value={rx.sphere?.left || ""}
            onChange={value => setRx(prev => ({ ...prev, sphere: { ...prev.sphere, left: value } }))}
            unit="diopter"
          />
          <InputWithUnits
            label="Cylinder (Right)"
            value={rx.cylinder?.right || ""}
            onChange={value => setRx(prev => ({ ...prev, cylinder: { ...prev.cylinder, right: value } }))}
            unit="diopter"
          />
          <InputWithUnits
            label="Cylinder (Left)"
            value={rx.cylinder?.left || ""}
            onChange={value => setRx(prev => ({ ...prev, cylinder: { ...prev.cylinder, left: value } }))}
            unit="diopter"
          />
          <InputWithUnits
            label="Axis (Right)"
            value={rx.axis?.right || ""}
            onChange={value => setRx(prev => ({ ...prev, axis: { ...prev.axis, right: value } }))}
            unit="degrees"
          />
          <InputWithUnits
            label="Axis (Left)"
            value={rx.axis?.left || ""}
            onChange={value => setRx(prev => ({ ...prev, axis: { ...prev.axis, left: value } }))}
            unit="degrees"
          />
          <InputWithUnits
            label="Add (Right)"
            value={rx.add?.right || ""}
            onChange={value => setRx(prev => ({ ...prev, add: { ...prev.add, right: value } }))}
            unit="diopter"
          />
          <InputWithUnits
            label="Add (Left)"
            value={rx.add?.left || ""}
            onChange={value => setRx(prev => ({ ...prev, add: { ...prev.add, left: value } }))}
            unit="diopter"
          />
          <InputWithUnits
            label="PD"
            value={rx.pd || {}}
            onChange={value => setRx(prev => ({ ...prev, pd: value }))}
            unit="mm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lens Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="lensType">Lens Type</Label>
          <Input
            id="lensType"
            type="text"
            value={lensType}
            onChange={e => setLensType(e.target.value)}
          />
          <Label htmlFor="coating">Coating</Label>
          <Input
            id="coating"
            type="text"
            value={coating}
            onChange={e => setCoating(e.target.value)}
          />
          <Label htmlFor="thickness">Thickness</Label>
          <Input
            id="thickness"
            type="text"
            value={thickness}
            onChange={e => setThickness(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frame Details</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedFrame ? (
            <div>
              <p>Brand: {selectedFrame.brand}</p>
              <p>Model: {selectedFrame.model}</p>
              <Button onClick={() => {
                setSelectedFrame(null);
              }}>Remove Frame</Button>
            </div>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Select Frame</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Select Frame</DialogTitle>
                  <DialogDescription>Search and select a frame for the work order.</DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="searchTerm">Search</Label>
                    <Input
                      id="searchTerm"
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="filterBrand">Brand</Label>
                    <Select value={filterBrand} onValueChange={setFilterBrand}>
                      <SelectTrigger id="filterBrand" className="w-full">
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {brands.map((brand: string) => (
                          <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="filterType">Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger id="filterType" className="w-full">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {types.map((type: string) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleFrameSearch}>Search</Button>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  {searchResults.map(frame => (
                    <Card key={frame.frameId} onClick={() => handleSelectFrame(frame)} className="cursor-pointer">
                      <CardContent>
                        <p>{frame.brand} {frame.model}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <DialogFooter>
                  <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Lens Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsContactLensDialogOpen(true)}>Select Contact Lenses</Button>

          {contactLensItems.length > 0 && (
            <ul>
              {contactLensItems.map(lens => (
                <li key={lens.id} className="flex items-center justify-between">
                  {lens.brand} {lens.type}
                  <Button onClick={() => handleRemoveContactLens(lens.id)} variant="ghost" size="sm">
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <Dialog open={isContactLensDialogOpen} onOpenChange={setIsContactLensDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Select Contact Lenses</DialogTitle>
                <DialogDescription>Search and select contact lenses for the work order.</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactLensSearchTerm">Search</Label>
                  <Input
                    id="contactLensSearchTerm"
                    type="text"
                    value={contactLensSearchTerm}
                    onChange={e => setContactLensSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactLensFilterBrand">Brand</Label>
                  <Select value={contactLensFilterBrand} onValueChange={setContactLensFilterBrand}>
                    <SelectTrigger id="contactLensFilterBrand" className="w-full">
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {contactLensBrands.map((brand: string) => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactLensFilterType">Type</Label>
                  <Select value={contactLensFilterType} onValueChange={setContactLensFilterType}>
                    <SelectTrigger id="contactLensFilterType" className="w-full">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {contactLensTypes.map((type: string) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleContactLensSearch}>Search</Button>

              <div className="grid grid-cols-3 gap-4 mt-4">
                {contactLensSearchResults.map(lens => (
                  <Card key={lens.id} onClick={() => handleSelectContactLens(lens)} className="cursor-pointer">
                    <CardContent>
                      <p>{lens.brand} {lens.type}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <DialogFooter>
                <Button onClick={() => setIsContactLensDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={notes} onChange={e => setNotes(e.target.value)} />
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};
