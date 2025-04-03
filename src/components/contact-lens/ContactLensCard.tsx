
import React from "react";
import { useLanguageStore } from "@/store/languageStore";
import { ContactLensItem } from "@/store/inventoryStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Contact, Edit } from "lucide-react";
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
}

export const ContactLensCard: React.FC<ContactLensCardProps> = ({ lens, onEdit }) => {
  const { language } = useLanguageStore();
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-blue-200">
      <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Contact className="h-4 w-4 text-blue-600" />
              {lens.brand} - {lens.type}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              {lens.price.toFixed(2)} KWD
              {lens.color && <span className="text-xs text-blue-500">| {lens.color}</span>}
            </CardDescription>
          </div>
          <Badge variant={lens.qty > 5 ? "outline" : "destructive"} className="text-xs">
            {lens.qty} {language === 'ar' ? 'في المخزون' : 'in stock'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3 text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">BC:</span>
          <span className="font-medium">{lens.bc}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{language === 'ar' ? 'القطر' : 'Diameter'}:</span>
          <span className="font-medium">{lens.diameter}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Power:</span>
          <span className="font-medium">{lens.power}</span>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <Button variant="ghost" className="rounded-none h-10 text-blue-600 w-full" onClick={() => onEdit(lens)}>
          <Edit className="h-4 w-4 mr-1" /> {language === 'ar' ? 'تعديل' : 'Edit'}
        </Button>
      </CardFooter>
    </Card>
  );
};
