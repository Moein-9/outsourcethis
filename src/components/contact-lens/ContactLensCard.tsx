
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { ContactLensItem } from "@/store/inventoryStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Contact, Edit, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContactLensCardProps {
  lens: ContactLensItem;
  onEdit: (lens: ContactLensItem) => void;
  onDelete: (id: string) => void;
}

export const ContactLensCard: React.FC<ContactLensCardProps> = ({ lens, onEdit, onDelete }) => {
  const { language } = useLanguageStore();
  
  // Generate consistent background color based on brand name
  const getBrandColor = (brand: string): string => {
    const colors = [
      'from-blue-50 to-blue-100 border-blue-200',
      'from-purple-50 to-purple-100 border-purple-200',
      'from-teal-50 to-teal-100 border-teal-200',
      'from-amber-50 to-amber-100 border-amber-200',
      'from-pink-50 to-pink-100 border-pink-200',
      'from-indigo-50 to-indigo-100 border-indigo-200',
      'from-emerald-50 to-emerald-100 border-emerald-200',
      'from-rose-50 to-rose-100 border-rose-200',
      'from-cyan-50 to-cyan-100 border-cyan-200',
      'from-orange-50 to-orange-100 border-orange-200'
    ];
    
    // Simple hash function for brand name to get consistent color
    let hash = 0;
    for (let i = 0; i < brand.length; i++) {
      hash = brand.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  const brandColorClass = getBrandColor(lens.brand);
  const textColorClass = brandColorClass.includes('blue') ? 'text-blue-600' : 
                        brandColorClass.includes('purple') ? 'text-purple-600' :
                        brandColorClass.includes('teal') ? 'text-teal-600' :
                        brandColorClass.includes('amber') ? 'text-amber-600' :
                        brandColorClass.includes('pink') ? 'text-pink-600' :
                        brandColorClass.includes('indigo') ? 'text-indigo-600' :
                        brandColorClass.includes('emerald') ? 'text-emerald-600' :
                        brandColorClass.includes('rose') ? 'text-rose-600' :
                        brandColorClass.includes('cyan') ? 'text-cyan-600' :
                        'text-orange-600';
  
  // Format color text - if it contains '|', display appropriate language portion
  const formatColorText = (colorText: string | undefined): string => {
    if (!colorText) return '';
    
    // If color contains a delimiter '|' for bilingual text
    if (colorText.includes('|')) {
      const [english, arabic] = colorText.split('|').map(part => part.trim());
      return language === 'ar' ? arabic : english;
    }
    
    return colorText;
  };
  
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-all duration-200 border bg-gradient-to-r ${brandColorClass}`}>
      <CardHeader className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Contact className={`h-4 w-4 ${textColorClass}`} />
              {lens.brand} - {lens.type}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              {lens.price.toFixed(2)} KWD
              {lens.color && <span className={`text-xs ${textColorClass}`}>| {formatColorText(lens.color)}</span>}
            </CardDescription>
          </div>
          <Badge variant={lens.qty > 5 ? "outline" : "destructive"} className={`text-xs ${lens.qty > 5 ? textColorClass : ''}`}>
            {lens.qty} {language === 'ar' ? 'في المخزون' : 'in stock'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground font-medium">BC:</span>
          <span className="font-medium">{lens.bc}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground font-medium">{language === 'ar' ? 'القطر' : 'Diameter'}:</span>
          <span className="font-medium">{lens.diameter}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <div className="grid grid-cols-2 w-full">
          <Button 
            variant="ghost" 
            className={`rounded-none h-10 ${textColorClass} hover:bg-white/50 border-r`} 
            onClick={() => onEdit(lens)}
          >
            <Edit className="h-4 w-4 mr-1" /> {language === 'ar' ? 'تعديل' : 'Edit'}
          </Button>
          <Button 
            variant="ghost" 
            className="rounded-none h-10 text-destructive hover:bg-white/50 hover:text-destructive/80" 
            onClick={() => onDelete(lens.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> {language === 'ar' ? 'حذف' : 'Delete'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
