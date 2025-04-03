import React, { useState, useEffect } from "react";
import { useInventoryStore, LensType, LensCoating, LensThickness } from "@/store/inventoryStore";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Edit, Save, Plus, XCircle, Search, Database } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  
  const [selectedLensType, setSelectedLensType] = useState<string>("");
  const [selectedCoating, setSelectedCoating] = useState<string>("");
  const [selectedThickness, setSelectedThickness] = useState<string>("");
  const [combinationPrice, setCombinationPrice] = useState<string>("");
  
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
    
    const newCombination = {
      lensTypeId: selectedLensType,
      coatingId: selectedCoating,
      thicknessId: selectedThickness,
      price
    };
    
    try {
      console.log("Adding new combination:", newCombination);
      const id = addLensPricingCombination(newCombination);
      
      if (id) {
        console.log("Combination added with ID:", id);
        toast({
          description: t('combinationAdded'),
        });
        
        setTimeout(loadPricingCombinations, 50);
        resetForm();
      }
    } catch (error) {
      console.error("Error adding combination:", error);
      toast({
        title: t('error'),
        description: t('errorAddingCombination'),
        variant: "destructive"
      });
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
    
    try {
      updateLensPricingCombination(id, { price });
      
      toast({
        description: t('combinationUpdated'),
      });
      
      loadPricingCombinations();
      setEditingId(null);
      setEditPrice("");
    } catch (error) {
      console.error("Error updating combination:", error);
      toast({
        title: t('error'),
        description: t('errorUpdatingCombination'),
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteCombination = (id: string) => {
    try {
      deleteLensPricingCombination(id);
      
      toast({
        description: t('combinationDeleted'),
      });
      
      loadPricingCombinations();
    } catch (error) {
      console.error("Error deleting combination:", error);
      toast({
        title: t('error'),
        description: t('errorDeletingCombination'),
        variant: "destructive"
      });
    }
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
    const lensType = lensTypes.find(lt => lt.id === id);
    if (!lensType) return t('unknown');
    
    return language === 'ar' && lensType.name 
      ? lensType.name 
      : lensType.name;
  };
  
  const getCoatingName = (id: string) => {
    const coating = lensCoatings.find(c => c.id === id);
    if (!coating) return t('unknown');
    
    return coating.name;
  };
  
  const getThicknessName = (id: string) => {
    const thickness = lensThicknesses.find(t => t.id === id);
    if (!thickness) return t('unknown');
    
    return thickness.name;
  };

  const groupedCoatings = lensCoatings.reduce((acc, coating) => {
    if (!acc[coating.category]) {
      acc[coating.category] = [];
    }
    acc[coating.category].push(coating);
    return acc;
  }, {} as Record<string, LensCoating[]>);

  const groupedThicknesses = lensThicknesses.reduce((acc, thickness) => {
    if (!acc[thickness.category]) {
      acc[thickness.category] = [];
    }
    acc[thickness.category].push(thickness);
    return acc;
  }, {} as Record<string, LensThickness[]>);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'distance-reading':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'progressive':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'bifocal':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'distance-reading':
        return language === 'ar' ? 'النظارات أحادية الرؤية (Single Vision)' : 'Single Vision';
      case 'progressive':
        return language === 'ar' ? 'النظارات متعددة البؤر (Progressive)' : 'Progressive';
      case 'bifocal':
        return language === 'ar' ? 'النظارات ثنائية البؤرة (Bifocal)' : 'Bifocal';
      default:
        return category;
    }
  };

  const getSubcategoryInfo = (subcategory: string, category: string) => {
    let name = '';
    let color = '';

    switch(subcategory) {
      case 'basic':
        name = language === 'ar' ? 'أساسي (Basic)' : 'Basic';
        color = 'bg-green-50 text-green-700 border-green-100';
        break;
      case 'filter':
        name = language === 'ar' ? 'فلتر (Filter)' : 'Filter';
        color = 'bg-indigo-50 text-indigo-700 border-indigo-100';
        break;
      case 'super-filter':
        name = language === 'ar' ? 'سوبر فلتر (Super Filter)' : 'Super Filter';
        color = 'bg-violet-50 text-violet-700 border-violet-100';
        break;
      case 'photochromic':
        name = language === 'ar' ? 'فوتوكروميك (Photochromic)' : 'Photochromic';
        color = 'bg-rose-50 text-rose-700 border-rose-100';
        break;
      case 'standard':
        name = language === 'ar' ? 'قياسي (Standard)' : 'Standard';
        color = 'bg-teal-50 text-teal-700 border-teal-100';
        break;
      case 'thin':
        name = language === 'ar' ? 'رفيع (Thin)' : 'Thin';
        color = 'bg-sky-50 text-sky-700 border-sky-100';
        break;
      case 'ultra-thin':
        name = language === 'ar' ? 'رفيع جداً (Ultra Thin)' : 'Ultra Thin';
        color = 'bg-cyan-50 text-cyan-700 border-cyan-100';
        break;
      case 'poly':
        name = language === 'ar' ? 'بولي (Poly)' : 'Polycarbonate';
        color = 'bg-blue-50 text-blue-700 border-blue-100';
        break;
      default:
        name = subcategory;
        color = 'bg-gray-50 text-gray-700 border-gray-100';
    }

    return { name, color };
  };

  return (
    <div className="space-y-6" dir={dirClass}>
      <Card className="border-blue-100">
        <CardHeader className="bg-blue-50">
          <CardTitle className={textAlignClass}>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              {t('addNewCombination')}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lensType" className={textAlignClass}>
                {t('selectLensType')}
              </Label>
              <Select 
                value={selectedLensType} 
                onValueChange={setSelectedLensType}
              >
                <SelectTrigger id="lensType" className="bg-white">
                  <SelectValue placeholder={t('selectLensType')} />
                </SelectTrigger>
                <SelectContent className="bg-white z-[200]">
                  <SelectGroup>
                    <SelectLabel className={`${getCategoryColor('distance-reading')} px-3 py-1 rounded-md font-medium mb-1`}>
                      {getCategoryName('distance-reading')}
                    </SelectLabel>
                    {lensTypes.filter(type => type.type === 'distance' || type.type === 'reading' || type.type === 'sunglasses').map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator className="my-2" />
                  <SelectGroup>
                    <SelectLabel className={`${getCategoryColor('progressive')} px-3 py-1 rounded-md font-medium mb-1`}>
                      {getCategoryName('progressive')}
                    </SelectLabel>
                    {lensTypes.filter(type => type.type === 'progressive').map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator className="my-2" />
                  <SelectGroup>
                    <SelectLabel className={`${getCategoryColor('bifocal')} px-3 py-1 rounded-md font-medium mb-1`}>
                      {getCategoryName('bifocal')}
                    </SelectLabel>
                    {lensTypes.filter(type => type.type === 'bifocal').map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coating" className={textAlignClass}>
                {t('selectCoating')}
              </Label>
              <Select 
                value={selectedCoating} 
                onValueChange={setSelectedCoating}
              >
                <SelectTrigger id="coating" className="bg-white">
                  <SelectValue placeholder={t('selectCoating')} />
                </SelectTrigger>
                <SelectContent className="bg-white z-[200]">
                  {Object.entries(groupedCoatings).map(([category, coatings]) => (
                    <React.Fragment key={category}>
                      <SelectGroup>
                        <SelectLabel className={`${getCategoryColor(category)} px-3 py-1 rounded-md font-medium mb-1`}>
                          {getCategoryName(category)}
                        </SelectLabel>
                        {coatings.map(coating => {
                          const subInfo = getSubcategoryInfo(coating.category || 'basic', category);
                          return (
                            <SelectItem key={coating.id} value={coating.id} className="py-2">
                              <div className="flex flex-col">
                                <span className={`${subInfo.color} px-2 py-0.5 rounded text-sm font-medium mb-0.5 inline-block w-fit`}>
                                  {subInfo.name}
                                </span>
                                <span>
                                  {coating.name}
                                </span>
                                {coating.description && (
                                  <span className="text-xs text-gray-500">
                                    {coating.description}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                      {Object.keys(groupedCoatings).indexOf(category) < Object.keys(groupedCoatings).length - 1 && (
                        <SelectSeparator className="my-2" />
                      )}
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thickness" className={textAlignClass}>
                {t('selectThickness')}
              </Label>
              <Select 
                value={selectedThickness} 
                onValueChange={setSelectedThickness}
              >
                <SelectTrigger id="thickness" className="bg-white">
                  <SelectValue placeholder={t('selectThickness')} />
                </SelectTrigger>
                <SelectContent className="bg-white z-[200]">
                  {Object.entries(groupedThicknesses).map(([category, thicknesses]) => (
                    <React.Fragment key={category}>
                      <SelectGroup>
                        <SelectLabel className={`${getCategoryColor(category)} px-3 py-1 rounded-md font-medium mb-1`}>
                          {getCategoryName(category)}
                        </SelectLabel>
                        {thicknesses.map(thickness => {
                          const subInfo = getSubcategoryInfo(thickness.category || 'standard', category);
                          return (
                            <SelectItem key={thickness.id} value={thickness.id} className="py-2">
                              <div className="flex flex-col">
                                <span className={`${subInfo.color} px-2 py-0.5 rounded text-sm font-medium mb-0.5 inline-block w-fit`}>
                                  {subInfo.name}
                                </span>
                                <span>
                                  {thickness.name}
                                </span>
                                {thickness.description && (
                                  <span className="text-xs text-gray-500">
                                    {thickness.description}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                      {Object.keys(groupedThicknesses).indexOf(category) < Object.keys(groupedThicknesses).length - 1 && (
                        <SelectSeparator className="my-2" />
                      )}
                    </React.Fragment>
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
                className={`${textAlignClass} bg-white`}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleAddCombination} 
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder={t('searchCombinations')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('lensTypes')}</TableHead>
                  <TableHead>{t('lensCoatings')}</TableHead>
                  <TableHead>{t('lensThicknesses')}</TableHead>
                  <TableHead>{t('price')} (KWD)</TableHead>
                  <TableHead className="text-center">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCombinations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      {searchTerm ? t('noMatchingCombinations') : t('noCombinations')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCombinations.map((combination) => (
                    <TableRow key={combination.id}>
                      <TableCell>{getLensTypeName(combination.lensTypeId)}</TableCell>
                      <TableCell>{getCoatingName(combination.coatingId)}</TableCell>
                      <TableCell>{getThicknessName(combination.thicknessId)}</TableCell>
                      <TableCell>
                        {editingId === combination.id ? (
                          <Input
                            type="number"
                            step="0.001"
                            min="0"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 bg-white"
                          />
                        ) : (
                          <>{combination.price.toFixed(3)}</>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          {editingId === combination.id ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdateCombination(combination.id)}
                                title={t('save')}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setEditingId(null)}
                                title={t('cancel')}
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
                                title={t('edit')}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => handleDeleteCombination(combination.id)}
                                title={t('delete')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
