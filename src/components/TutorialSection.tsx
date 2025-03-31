
import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguageStore } from "@/store/languageStore"
import { Play } from "lucide-react"

export interface TutorialChapter {
  id: string
  title: string
  titleAr?: string
  description: string
  descriptionAr?: string
  youtubeUrl: string
  thumbnail?: string
  duration?: string
  category?: string
}

interface TutorialChapterCardProps {
  chapter: TutorialChapter
  onSelect: (chapter: TutorialChapter) => void
}

export function TutorialChapterCard({ chapter, onSelect }: TutorialChapterCardProps) {
  const { language } = useLanguageStore()
  const isArabic = language === 'ar'
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all cursor-pointer border border-border/50 hover:border-primary/50"
      onClick={() => onSelect(chapter)}
    >
      <div className="relative">
        <div className="aspect-video bg-muted/30 flex items-center justify-center overflow-hidden">
          {chapter.thumbnail ? (
            <img 
              src={chapter.thumbnail} 
              alt={isArabic && chapter.titleAr ? chapter.titleAr : chapter.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted/50">
              <Play className="h-10 w-10 text-muted-foreground/50" />
            </div>
          )}
        </div>
        {chapter.duration && (
          <Badge variant="secondary" className="absolute bottom-2 right-2 bg-background/80 text-foreground">
            {chapter.duration}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {isArabic && chapter.titleAr ? chapter.titleAr : chapter.title}
        </CardTitle>
        {chapter.category && (
          <Badge variant="outline" className="w-fit">
            {chapter.category}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {isArabic && chapter.descriptionAr 
          ? chapter.descriptionAr 
          : chapter.description}
      </CardContent>
    </Card>
  )
}

interface TutorialSectionProps {
  chapters: TutorialChapter[]
  onSelectChapter: (chapter: TutorialChapter) => void
}

export function TutorialSection({ chapters, onSelectChapter }: TutorialSectionProps) {
  const { t } = useLanguageStore()
  
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter) => (
          <TutorialChapterCard 
            key={chapter.id} 
            chapter={chapter} 
            onSelect={onSelectChapter} 
          />
        ))}
      </div>
    </div>
  )
}
