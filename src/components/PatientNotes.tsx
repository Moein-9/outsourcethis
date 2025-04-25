import React, { useState, useEffect } from "react";
import { usePatientStore, PatientNote } from "@/store/patientStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/languageStore";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import {
  MessageSquare,
  PlusCircle,
  X,
  Edit,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface PatientNotesProps {
  patientId: string;
}

export const PatientNotes: React.FC<PatientNotesProps> = ({ patientId }) => {
  const { t, language } = useLanguageStore();
  const { addPatientNote, deletePatientNote, getPatientById, updatePatient } =
    usePatientStore();
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNoteText, setEditedNoteText] = useState("");
  const [notes, setNotes] = useState<PatientNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const isRtl = language === "ar";

  // Fetch patient notes from Supabase
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("patient_notes")
          .select("*")
          .eq("patient_id", patientId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching patient notes:", error);
          toast.error(
            language === "ar"
              ? "حدث خطأ أثناء جلب الملاحظات"
              : "Error fetching notes"
          );
          return;
        }

        // Transform to match the PatientNote interface
        const transformedData: PatientNote[] = data.map((note) => ({
          id: note.id,
          text: note.note_text,
          createdAt: note.created_at,
          patientId: note.patient_id,
        }));

        setNotes(transformedData);
      } catch (error) {
        console.error("Error fetching patient notes:", error);
        toast.error(
          language === "ar"
            ? "حدث خطأ غير متوقع"
            : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchNotes();
    }
  }, [patientId, language]);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error(
        language === "ar" ? "الرجاء إدخال ملاحظة" : "Please enter a note"
      );
      return;
    }

    try {
      setIsSaving(true);

      // Add to Supabase
      const { data, error } = await supabase
        .from("patient_notes")
        .insert({
          patient_id: patientId,
          note_text: newNote,
        })
        .select();

      if (error) {
        console.error("Error adding patient note:", error);
        toast.error(
          language === "ar"
            ? "حدث خطأ أثناء إضافة الملاحظة"
            : "Error adding note"
        );
        return;
      }

      // Format the new note to match PatientNote interface
      const newNoteObj: PatientNote = {
        id: data[0].id,
        text: data[0].note_text,
        createdAt: data[0].created_at,
      };

      // Update local state
      setNotes((prevNotes) => [newNoteObj, ...prevNotes]);

      // Also update patientStore for backward compatibility
      addPatientNote(patientId, newNote);

      setNewNote("");
      toast.success(
        language === "ar"
          ? "تمت إضافة الملاحظة بنجاح"
          : "Note added successfully"
      );
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error(
        language === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setIsDeleting(noteId);

      // Delete from Supabase
      const { error } = await supabase
        .from("patient_notes")
        .delete()
        .eq("id", noteId);

      if (error) {
        console.error("Error deleting patient note:", error);
        toast.error(
          language === "ar"
            ? "حدث خطأ أثناء حذف الملاحظة"
            : "Error deleting note"
        );
        return;
      }

      // Update local state
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));

      // Also update patientStore for backward compatibility
      deletePatientNote(patientId, noteId);

      toast.success(
        language === "ar"
          ? "تم حذف الملاحظة بنجاح"
          : "Note deleted successfully"
      );
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error(
        language === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred"
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const startEditingNote = (note: PatientNote) => {
    setEditingNoteId(note.id);
    setEditedNoteText(note.text);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditedNoteText("");
  };

  const saveEditedNote = async (noteId: string) => {
    if (!editedNoteText.trim()) {
      toast.error(
        language === "ar" ? "الرجاء إدخال ملاحظة" : "Please enter a note"
      );
      return;
    }

    try {
      setIsSaving(true);

      // Update in Supabase
      const { data, error } = await supabase
        .from("patient_notes")
        .update({
          note_text: editedNoteText,
          updated_at: new Date().toISOString(),
        })
        .eq("id", noteId)
        .select();

      if (error) {
        console.error("Error updating patient note:", error);
        toast.error(
          language === "ar"
            ? "حدث خطأ أثناء تحديث الملاحظة"
            : "Error updating note"
        );
        return;
      }

      // Update local state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, text: editedNoteText } : note
        )
      );

      // Also update patientStore for backward compatibility
      const patient = getPatientById(patientId);
      if (patient) {
        const updatedNotes =
          patient.patientNotes?.map((note) =>
            note.id === noteId ? { ...note, text: editedNoteText } : note
          ) || [];

        updatePatient({
          ...patient,
          patientNotes: updatedNotes,
        });
      }

      setEditingNoteId(null);
      toast.success(
        language === "ar"
          ? "تم تحديث الملاحظة بنجاح"
          : "Note updated successfully"
      );
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error(
        language === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp", {
        locale: isRtl ? ar : undefined,
      });
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t("patientNotes")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          {t("patientNotes")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 border rounded-md bg-card shadow-sm relative ${
                  isRtl ? "text-right" : "text-left"
                }`}
                dir={isRtl ? "rtl" : "ltr"}
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedNoteText}
                      onChange={(e) => setEditedNoteText(e.target.value)}
                      dir="auto"
                      className="w-full"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                          e.preventDefault();
                          saveEditedNote(note.id);
                        }
                      }}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
                        disabled={isSaving}
                      >
                        <X className="h-3 w-3 mr-1" /> {t("cancel")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => saveEditedNote(note.id)}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />{" "}
                            {language === "ar" ? "جاري الحفظ..." : "Saving..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-3 w-3 mr-1" /> {t("save")}
                          </>
                        )}
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
                        disabled={isDeleting === note.id}
                      >
                        {isDeleting === note.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm mb-2 whitespace-pre-wrap pr-12">
                      {note.text}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(note.createdAt)}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">{t("noNotesYet")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("addNoteBelow")}
            </p>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <Textarea
            placeholder={t("addNoteHere")}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            dir="auto"
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                handleAddNote();
              }
            }}
          />
          <Button
            onClick={handleAddNote}
            className="w-full sm:w-auto gap-1"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {language === "ar" ? "جاري الإضافة..." : "Adding..."}
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4" />
                {t("addNote")}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
