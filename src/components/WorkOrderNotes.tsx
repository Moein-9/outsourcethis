
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

interface WorkOrderNotesProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const WorkOrderNotes: React.FC<WorkOrderNotesProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const { t, language } = useLanguageStore();
  const textAlignClass = language === 'ar' ? 'text-right' : 'text-left';
  
  return (
    <div className={`space-y-2 ${className}`}>
      <Label 
        htmlFor="workOrderNotes" 
        className={`flex items-center gap-1.5 text-muted-foreground ${textAlignClass}`}
      >
        <MessageSquare className="h-4 w-4 text-primary" />
        {t('workOrderNotes')}
      </Label>
      <Textarea
        id="workOrderNotes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('enterNotesHere')}
        className={`min-h-[80px] ${textAlignClass}`}
      />
    </div>
  );
};
