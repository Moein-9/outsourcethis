
import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, UserSearch, Filter } from "lucide-react";
import { toast } from "sonner";

interface PatientSearchFormProps {
  onSearch: (searchTerm: string, visitDateFilter: string) => void;
  onClear: () => void;
}

export const PatientSearchForm: React.FC<PatientSearchFormProps> = ({
  onSearch,
  onClear
}) => {
  const { language, t } = useLanguageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [visitDateFilter, setVisitDateFilter] = useState<string>("all_visits");
  
  const isRtl = language === 'ar';
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error(language === 'ar' ? "الرجاء إدخال مصطلح البحث" : "Please enter a search term");
      return;
    }
    
    onSearch(searchTerm, visitDateFilter);
  };
  
  const handleClear = () => {
    setSearchTerm("");
    setVisitDateFilter("all_visits");
    onClear();
  };
  
  return (
    <Card className={isRtl ? "text-right" : "text-left"}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
          <UserSearch className="h-5 w-5 text-primary" />
          {t('searchClient')}
        </CardTitle>
        <CardDescription>
          {language === 'ar' 
            ? "ابحث عن العملاء بواسطة الاسم، رقم الهاتف، أو أي معلومات شخصية"
            : "Search for clients by name, phone number, or any personal information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isRtl ? "ابحث عن عميل..." : "Search for a client..."}
                className={isRtl ? "pr-9 text-right" : "pl-9 text-left"}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div className={`flex gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <Button onClick={handleSearch} className="shrink-0">
                <Search className={`h-4 w-4 ${isRtl ? 'ml-1' : 'mr-1'}`} />
                {t('search')}
              </Button>
              <Button variant="outline" onClick={handleClear} className="shrink-0">
                {isRtl ? "مسح" : "Clear"}
              </Button>
            </div>
          </div>
          
          <div className={`flex flex-col sm:flex-row gap-3 pt-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <Label htmlFor="visitDateFilter" className="whitespace-nowrap">
                {isRtl ? "تاريخ الزيارة:" : "Visit Date:"}
              </Label>
              <Select value={visitDateFilter} onValueChange={setVisitDateFilter}>
                <SelectTrigger id="visitDateFilter" className={`w-[140px] ${isRtl ? "text-right" : "text-left"}`}>
                  <SelectValue placeholder={isRtl ? "جميع الزيارات" : "All Visits"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_visits">{isRtl ? "جميع الزيارات" : "All Visits"}</SelectItem>
                  <SelectItem value="last_week">{isRtl ? "الأسبوع الماضي" : "Last Week"}</SelectItem>
                  <SelectItem value="last_month">{isRtl ? "الشهر الماضي" : "Last Month"}</SelectItem>
                  <SelectItem value="last_year">{isRtl ? "السنة الماضية" : "Last Year"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className={isRtl ? "mr-auto" : "ml-auto"}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
