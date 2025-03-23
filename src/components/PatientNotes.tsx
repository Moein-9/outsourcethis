
import React, { useState } from 'react';
import { usePatientStore, PatientNote } from '@/store/patientStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { X, MessageSquare, PlusCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PatientNotesProps {
  patientId: string;
  notes?: PatientNote[];
}

export const PatientNotes: React.FC<PatientNotesProps> = ({ patientId, notes = [] }) => {
  const { t, language } = useLanguageStore();
  const { addPatientNote, deletePatientNote } = usePatientStore();
  const [newNote, setNewNote] = useState('');
  const isRtl = language === 'ar';
  
  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast({
        title: t("error"),
        description: t("noteEmpty"),
        variant: "destructive",
      });
      return;
    }
    
    addPatientNote(patientId, newNote);
    setNewNote('');
    
    toast({
      title: t("success"),
      description: t("noteAdded"),
    });
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPpp', { locale: isRtl ? ar : undefined });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <Card className="mt-8 w-full border-t-4 border-t-amber-400 shadow-md">
      <CardHeader className="bg-amber-50 pb-2">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <MessageSquare className="h-5 w-5" />
          {t("patientNotes")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 max-h-80 overflow-y-auto">
        {notes.length > 0 ? (
          <div className="space-y-3">
            {[...notes].reverse().map((note) => (
              <div 
                key={note.id} 
                className={`p-3 border rounded-md shadow-sm relative ${isRtl ? 'text-right' : 'text-left'} bg-amber-50/50`}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <Button
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1 right-1 h-6 w-6 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => deletePatientNote(patientId, note.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <p className="text-sm mb-2 whitespace-pre-wrap">{note.text}</p>
                <p className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            {t("noNotesYet")}
          </p>
        )}
      </CardContent>
      <CardFooter className="bg-amber-50 p-4 flex gap-2 flex-wrap">
        <Input
          placeholder={t("addNoteHere")}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          dir="auto"
          className="flex-1 border-amber-200 focus-visible:ring-amber-400"
          onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
        />
        <Button 
          onClick={handleAddNote}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          {isRtl ? "إضافة ملاحظة" : "Add Note"}
        </Button>
      </CardFooter>
    </Card>
  );
};
