
import React from 'react';
import { Clock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguageStore } from "@/store/languageStore";

interface EditedBadgeProps {
  lastEditedAt?: string;
  editNotes?: string;
  size?: 'sm' | 'md';
}

export const EditedBadge: React.FC<EditedBadgeProps> = ({ 
  lastEditedAt, 
  editNotes,
  size = 'md'
}) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  if (!lastEditedAt) return null;
  
  const formattedDate = new Date(lastEditedAt).toLocaleString();
  const smallSize = size === 'sm';
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`
            ${smallSize ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'} 
            inline-flex items-center gap-1 
            bg-amber-50 text-amber-700 rounded-full border border-amber-200
            cursor-help
          `}>
            <Clock className={smallSize ? 'w-3 h-3' : 'w-4 h-4'} />
            <span>{isRtl ? 'معدل' : 'Edited'}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div>
            <p className="font-medium">{isRtl ? 'تم تعديل هذا الطلب' : 'This order has been edited'}</p>
            <p className="text-xs text-muted-foreground">{isRtl ? 'آخر تعديل' : 'Last edit'}: {formattedDate}</p>
            {editNotes && (
              <p className="text-xs mt-1 pt-1 border-t">{editNotes}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
