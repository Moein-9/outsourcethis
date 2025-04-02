
import React, { useState, useEffect } from "react";
import { useInventoryStore, LensType, LensCoating, LensThickness } from "@/store/inventoryStore";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Edit, Save, Plus, XCircle, ChevronUp, ChevronDown, Search } from "lucide-react";

interface LensPricingCombination {
  id: string;
  lensTypeId: string;
  coatingId: string;
  thicknessId: string;
  price: number;
}

export const LensCombinationManager: React.FC = () => {
  const { t, language } = useLanguageStore();
  const lensTypes = useInventoryStore((state) => state.lensTypes);
  const lensCoatings = useInventoryStore((state) => state.lensCoatings);
  const lensThicknesses = useInventoryStore((state) => state.lensThicknesses);
  const getLensPricingCombinations = useInventoryStore((state) => state.getLensPricingCombinations);
  const addLensPricingCombination = useInventoryStore((state) => state.addLensPricingCombination);
  const updateLensPricingCombination = useInventoryStore((state) => state.updateLensPricingCombination);
  const deleteLensPricingCombination = useInventoryStore((state) => state.deleteLensPricingCombination);
  
  const [pricingCombinations, setPricingCombinations] = useState<LensPricingCombination[]>([]);
  const [filteredCombinations, setFilteredCombinations] = useState<LensPricingCombination[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New combination form
  const [selectedLensType, setSelectedLensType] = useState<string>("");
  const [selectedCoating, setSelectedCoating] = useState<string>("");
  const [selectedThickness, setSelectedThickness] = useState<string>("");
  const [combinationPrice, setCombinationPrice] = useState<string>("");
  
  // Edit form
  const [editPrice, setEditPrice] = useState<string>("");
  
  const dirClass = language === 'ar' ? 'rtl' : 'ltr';
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  useEffect(() => {
    loadPricingCombinations();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      filterCombinations();
    } else {
      setFilteredCombinations(pricingCombinations);
    }
  }, [searchTerm, pricingCombinations]);
  
  const loadPricingCombinations = () => {
    const combinations = getLensPricingCombinations();
    setPricingCombinations(combinations);
    setFilteredCombinations(combinations);
  };
  
  const filterCombinations = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = pricingCombinations.filter((combo) => {
      const lensType = lensTypes.find(lt => lt.id === combo.lensTypeId);
      const coating = lensCoatings.find(c => c.id === combo.coatingId);
      const thickness = lensThicknesses.find(t => t.id === combo.thicknessId);
      
      return (
        (lensType?.name.toLowerCase().includes(lowerSearchTerm) || false) ||
        (coating?.name.toLowerCase().includes(lowerSearchTerm) || false) ||
        (thickness?.name.toLowerCase().includes(lowerSearchTerm) || false)
      );
    });
    
    setFilteredCombinations(filtered);
  };
  
  const handleAddCombination = () => {
    if (!selectedLensType || !selectedCoating || !selectedThickness || !combinationPrice) {
      toast({
        title: t('error'),
        description: t('allFieldsRequired'),
        variant: "destructive"
      });
      return;
    }
    
    const price = parseFloat(combinationPrice);
    if (isNaN(price) || price < 0) {
      toast({
        title: t('error'),
        description: t('invalidPrice'),
        variant: "destructive"
      });
      return;
    }
    
    // Check for existing combination
    const exists = pricingCombinations.some(
      c => c.lensTypeId === selectedLensType && 
           c.coatingId === selectedCoating && 
           c.thicknessId === selectedThickness
    );
    
    if (exists) {
      toast({
        title: t('error'),
        description: t('combinationExists'),
        variant: "destructive"
      });
      return;
    }
    
    const id = addLensPricingCombination({
      lensTypeId: selectedLensType,
      coatingId: selectedCoating,
      thicknessId: selectedThickness,
      price
    });
    
    if (id) {
      toast({
        description: t('combinationAdded'),
      });
      
      loadPricingCombinations();
      resetForm();
    }
  };
  
  const handleUpdateCombination = (id: string) => {
    if (!editPrice) {
      toast({
        title: t('error'),
        description: t('priceRequired'),
        variant: "destructive"
      });
      return;
    }
    
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) {
      toast({
        title: t('error'),
        description: t('invalidPrice'),
        variant: "destructive"
      });
      return;
    }
    
    updateLensPricingCombination(id, { price });
    
    toast({
      description: t('combinationUpdated'),
    });
    
    loadPricingCombinations();
    setEditingId(null);
    setEditPrice("");
  };
  
  const handleDeleteCombination = (id: string) => {
    deleteLensPricingCombination(id);
    
    toast({
      description: t('combinationDeleted'),
    });
    
    loadPricingCombinations();
  };
  
  const startEditing = (combination: LensPricingCombination) => {
    setEditingId(combination.id);
    setEditPrice(combination.price.toString());
  };
  
  const resetForm = () => {
    setSelectedLensType("");
    setSelectedCoating("");
    setSelectedThickness("");
    setCombinationPrice("");
  };
  
  const getLensTypeName = (id: string) => {
    return lensTypes.find(lt => lt.id === id)?.name || "Unknown";
  };
  
  const getCoatingName = (id: string) => {
    return lensCoatings.find(c => c.id === id)?.name || "Unknown";
  };
  
  const getThicknessName = (id: string) => {
    return lensThicknesses.find(t => t.id === id)?.name || "Unknown";
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className={textAlignClass}>{t('addNewCombination')}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lensType" className={textAlignClass}>
                {language === 'ar' ? 'اختر نوع العدسة' : 'Select Lens Type'}
              </Label>
              <Select value={selectedLensType} onValueChange={setSelectedLensType}>
                <SelectTrigger id="lensType">
                  <SelectValue placeholder={language === 'ar' ? 'اختر نوع العدسة' : 'Select Lens Type'} />
                </SelectTrigger>
                <SelectContent>
                  {lensTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coating" className={textAlignClass}>
                {language === 'ar' ? 'اختر الطلاءات' : 'Select Coating'}
              </Label>
              <Select value={selectedCoating} onValueChange={setSelectedCoating}>
                <SelectTrigger id="coating">
                  <SelectValue placeholder={language === 'ar' ? 'اختر الطلاءات' : 'Select Coating'} />
                </SelectTrigger>
                <SelectContent>
                  {lensCoatings.map((coating) => (
                    <SelectItem key={coating.id} value={coating.id}>
                      {coating.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thickness" className={textAlignClass}>
                {language === 'ar' ? 'اختر سماكة العدسة' : 'Select Thickness'}
              </Label>
              <Select value={selectedThickness} onValueChange={setSelectedThickness}>
                <SelectTrigger id="thickness">
                  <SelectValue placeholder={language === 'ar' ? 'اختر سماكة العدسة' : 'Select Thickness'} />
                </SelectTrigger>
                <SelectContent>
                  {lensThicknesses.map((thickness) => (
                    <SelectItem key={thickness.id} value={thickness.id}>
                      {thickness.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price" className={textAlignClass}>{t('price')} (KWD)</Label>
              <Input
                id="price"
                type="number"
                step="0.001"
                min="0"
                value={combinationPrice}
                onChange={(e) => setCombinationPrice(e.target.value)}
                className={textAlignClass}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleAddCombination} 
            className="w-full mt-4"
          >
            <Plus className="mr-2 h-4 w-4" /> {t('addCombination')}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <CardTitle>{t('lensPricingCombinations')}</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder={t('searchCombinations')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-2 text-left">{language === 'ar' ? 'نوع العدسة' : 'Lens Type'}</th>
                  <th className="p-2 text-left">{language === 'ar' ? 'الطلاءات' : 'Coating'}</th>
                  <th className="p-2 text-left">{language === 'ar' ? 'سماكة العدسة' : 'Thickness'}</th>
                  <th className="p-2 text-left">{t('price')} (KWD)</th>
                  <th className="p-2 text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCombinations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      {searchTerm ? t('noMatchingCombinations') : t('noCombinations')}
                    </td>
                  </tr>
                ) : (
                  filteredCombinations.map((combination) => (
                    <tr key={combination.id} className="border-b hover:bg-muted/20">
                      <td className="p-2">{getLensTypeName(combination.lensTypeId)}</td>
                      <td className="p-2">{getCoatingName(combination.coatingId)}</td>
                      <td className="p-2">{getThicknessName(combination.thicknessId)}</td>
                      <td className="p-2">
                        {editingId === combination.id ? (
                          <Input
                            type="number"
                            step="0.001"
                            min="0"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24"
                          />
                        ) : (
                          <>{combination.price.toFixed(3)}</>
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex justify-center gap-2">
                          {editingId === combination.id ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdateCombination(combination.id)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingId(null)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => startEditing(combination)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleDeleteCombination(combination.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
