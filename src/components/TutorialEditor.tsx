
import React, { useState } from "react"
import { TutorialChapter } from "./TutorialSection"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguageStore } from "@/store/languageStore"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Plus, Save, X, Trash, ArrowUp, ArrowDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { v4 as uuidv4 } from 'uuid'
import { useForm } from "react-hook-form"

// Available category options
const CATEGORIES = ["Basics", "Clients", "Billing", "Inventory", "Reports", "Transactions", "Other"];

interface TutorialEditorProps {
  chapters: TutorialChapter[]
  onSave: (chapters: TutorialChapter[]) => void
  onCancel: () => void
}

export function TutorialEditor({ chapters, onSave, onCancel }: TutorialEditorProps) {
  const { language } = useLanguageStore()
  const isArabic = language === 'ar'
  const [editingChapters, setEditingChapters] = useState<TutorialChapter[]>([...chapters])
  
  // Function to add a new blank chapter
  const handleAddChapter = () => {
    const newChapter: TutorialChapter = {
      id: uuidv4(),
      title: "New Chapter",
      titleAr: "فصل جديد",
      description: "Chapter description",
      descriptionAr: "وصف الفصل",
      youtubeUrl: "https://www.youtube.com/watch?v=",
      category: "Other"
    }
    setEditingChapters([...editingChapters, newChapter])
  }
  
  // Function to update a chapter
  const handleUpdateChapter = (index: number, field: keyof TutorialChapter, value: string) => {
    const updatedChapters = [...editingChapters]
    updatedChapters[index] = { 
      ...updatedChapters[index], 
      [field]: value 
    }
    setEditingChapters(updatedChapters)
  }
  
  // Function to remove a chapter
  const handleRemoveChapter = (index: number) => {
    const updatedChapters = [...editingChapters]
    updatedChapters.splice(index, 1)
    setEditingChapters(updatedChapters)
  }

  // Function to move a chapter up in the order
  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updatedChapters = [...editingChapters]
    const temp = updatedChapters[index]
    updatedChapters[index] = updatedChapters[index - 1]
    updatedChapters[index - 1] = temp
    setEditingChapters(updatedChapters)
  }

  // Function to move a chapter down in the order
  const handleMoveDown = (index: number) => {
    if (index === editingChapters.length - 1) return
    const updatedChapters = [...editingChapters]
    const temp = updatedChapters[index]
    updatedChapters[index] = updatedChapters[index + 1]
    updatedChapters[index + 1] = temp
    setEditingChapters(updatedChapters)
  }
  
  // Call the onSave function with the updated chapters
  const handleSave = () => {
    onSave(editingChapters)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {isArabic ? "تحرير فصول البرنامج التعليمي" : "Edit Tutorial Chapters"}
        </h3>
        <div className="flex gap-2">
          <Button 
            onClick={handleAddChapter} 
            variant="outline"
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            {isArabic ? "إضافة فصل" : "Add Chapter"}
          </Button>
          <Button 
            onClick={handleSave} 
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            {isArabic ? "حفظ التغييرات" : "Save Changes"}
          </Button>
          <Button 
            onClick={onCancel} 
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {editingChapters.map((chapter, index) => (
          <Card key={chapter.id} className="border border-border/50">
            <CardHeader className="pb-2 flex flex-row items-start justify-between">
              <CardTitle className="text-lg">
                {isArabic ? "تحرير الفصل" : "Edit Chapter"} {index + 1}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === editingChapters.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveChapter(index)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{isArabic ? "العنوان (الإنجليزية)" : "Title (English)"}</label>
                    <Input
                      value={chapter.title}
                      onChange={(e) => handleUpdateChapter(index, 'title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{isArabic ? "الوصف (الإنجليزية)" : "Description (English)"}</label>
                    <Textarea
                      value={chapter.description}
                      onChange={(e) => handleUpdateChapter(index, 'description', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{isArabic ? "العنوان (العربية)" : "Title (Arabic)"}</label>
                    <Input
                      value={chapter.titleAr || ''}
                      onChange={(e) => handleUpdateChapter(index, 'titleAr', e.target.value)}
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{isArabic ? "الوصف (العربية)" : "Description (Arabic)"}</label>
                    <Textarea
                      value={chapter.descriptionAr || ''}
                      onChange={(e) => handleUpdateChapter(index, 'descriptionAr', e.target.value)}
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{isArabic ? "رابط يوتيوب" : "YouTube URL"}</label>
                  <Input
                    value={chapter.youtubeUrl}
                    onChange={(e) => handleUpdateChapter(index, 'youtubeUrl', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{isArabic ? "المدة" : "Duration"}</label>
                    <Input
                      value={chapter.duration || ''}
                      onChange={(e) => handleUpdateChapter(index, 'duration', e.target.value)}
                      placeholder="5:30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{isArabic ? "الفئة" : "Category"}</label>
                    <Select
                      value={chapter.category || 'Other'}
                      onValueChange={(value) => handleUpdateChapter(index, 'category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isArabic ? "اختر فئة" : "Select a category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
