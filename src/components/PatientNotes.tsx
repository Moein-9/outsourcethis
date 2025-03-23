
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
import { usePatientStore } from '@/store/patientStore';
import { PlusCircle, Edit, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PatientNotes = () => {
  const { patientId } = useParams();
  const { t, language } = useLanguageStore();
  const { addNote, getNotesByPatientId, deleteNote, updateNote } = usePatientStore();
  const { toast } = useToast();
  const isRtl = language === 'ar';
  
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  useEffect(() => {
    if (patientId) {
      refreshNotes();
    }
  }, [patientId]);
  
  const refreshNotes = () => {
    if (patientId) {
      const patientNotes = getNotesByPatientId(patientId);
      setNotes(patientNotes);
    }
  };
  
  const handleAddNote = () => {
    if (!newNote.trim() || !patientId) return;
    
    addNote({
      patientId,
      text: newNote
    });
    
    // Immediately update the UI with the new note
    refreshNotes();
    
    // Show success toast
    toast({
      title: t("success"),
      description: t("noteAdded"),
    });
    
    // Clear the input
    setNewNote('');
  };
  
  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    // Immediately update UI
    refreshNotes();
    
    toast({
      title: t("noteDeleted"),
      description: t("noteDeletedSuccessfully"),
    });
  };
  
  const startEditing = (note: any) => {
    setEditingNoteId(note.id);
    setEditText(note.text);
  };
  
  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditText('');
  };
  
  const saveEdit = (noteId: string) => {
    if (!editText.trim()) return;
    
    updateNote(noteId, editText);
    
    // Immediately update UI
    refreshNotes();
    
    toast({
      title: t("success"),
      description: t("noteUpdated"),
    });
    
    // Exit edit mode
    setEditingNoteId(null);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-amber-400 to-amber-500 text-white">
          <CardTitle className="flex items-center gap-2">
            {t("patientNotes")}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex gap-2">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={t("enterNewNote")}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <Button 
                onClick={handleAddNote}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {isRtl ? "إضافة ملاحظة" : t("addNote")}
              </Button>
            </div>
            
            {notes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {t("noNotesYet")}
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {notes.map((note) => (
                  <Card key={note.id} className="border border-gray-200">
                    {editingNoteId === note.id ? (
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4 mr-1" />
                              {t("cancel")}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(note.id)}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              {t("save")}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    ) : (
                      <>
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div className="text-sm text-gray-500">
                              {new Date(note.timestamp).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(note)}
                                className="h-7 px-2 text-gray-500 hover:text-blue-500"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNote(note.id)}
                                className="h-7 px-2 text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="mt-2 whitespace-pre-wrap">{note.text}</p>
                        </CardContent>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 py-3 px-6 text-center text-sm text-gray-500">
          {t("notesVisibleToStaff")}
        </CardFooter>
      </Card>
    </div>
  );
};
