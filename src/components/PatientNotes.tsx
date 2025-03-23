
import React, { useState } from 'react';
import { usePatientStore, PatientNote } from '@/store/patientStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { MessageSquare, PlusCircle, X, Edit, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface PatientNotesProps {
  patientId: string;
  notes?: PatientNote[];
}

export const PatientNotes: React.FC<PatientNotesProps> = ({ patientId, notes = [] }) => {
  const { t, language } = useLanguageStore();
  const { addPatientNote, deletePatientNote, getPatientById, updatePatient } = usePatientStore();
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNoteText, setEditedNoteText] = useState('');
  const isRtl = language === 'ar';
  
  // Get the current patient's notes from the store
  const patient = getPatientById(patientId);
  const patientNotes = notes.length > 0 ? notes : (patient?.patientNotes || []);
  
  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error(t("noteEmpty"));
      return;
    }
    
    addPatientNote(patientId, newNote);
    setNewNote('');
    
    toast.success(t("noteAdded"));
  };
  
  const handleDeleteNote = (noteId: string) => {
    deletePatientNote(patientId, noteId);
    
    toast.success(t("noteDeleted"));
  };
  
  const startEditingNote = (note: PatientNote) => {
    setEditingNoteId(note.id);
    setEditedNoteText(note.text);
  };
  
  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditedNoteText('');
  };
  
  const saveEditedNote = (noteId: string) => {
    if (!editedNoteText.trim()) {
      toast.error(t("noteEmpty"));
      return;
    }
    
    // Update the note
    if (patient) {
      const updatedNotes = patient.patientNotes?.map(note => 
        note.id === noteId ? { ...note, text: editedNoteText } : note
      ) || [];
      
      updatePatient({
        ...patient,
        patientNotes: updatedNotes
      });
      
      setEditingNoteId(null);
      
      toast.success(t("noteUpdated"));
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPpp', { locale: isRtl ? ar : undefined });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <Card className="mt-8">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t("patientNotes")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mt-6 space-y-2">
          <Textarea
            placeholder={t("addNoteHere")}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            dir="auto"
            className="resize-none"
            onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && handleAddNote()}
          />
          <Button 
            onClick={handleAddNote}
            className="w-full sm:w-auto gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            {t("addNote")}
          </Button>
        </div>
        
        {patientNotes.length > 0 ? (
          <div className="space-y-3 mt-4">
            {[...patientNotes].reverse().map((note) => (
              <div 
                key={note.id} 
                className={`p-3 border rounded-md bg-card shadow-sm relative ${isRtl ? 'text-right' : 'text-left'}`}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedNoteText}
                      onChange={(e) => setEditedNoteText(e.target.value)}
                      dir="auto"
                      className="w-full"
                      onKeyPress={(e) => e.key === 'Enter' && e.ctrlKey && saveEditedNote(note.id)}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        <X className="h-3 w-3 mr-1" /> {t("cancel")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => saveEditedNote(note.id)}
                      >
                        <Save className="h-3 w-3 mr-1" /> {t("save")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-1 absolute top-1 right-1">
                      <Button
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-primary hover:text-primary-foreground"
                        onClick={() => startEditingNote(note)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm mb-2 whitespace-pre-wrap pr-12">{note.text}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(note.createdAt)}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mt-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">{t("noNotesYet")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("addNoteBelow")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
