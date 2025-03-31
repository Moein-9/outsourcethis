
import React from "react"
import { useLanguageStore } from "@/store/languageStore"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TutorialChapter } from "./TutorialSection"

interface VideoPlayerProps {
  chapter: TutorialChapter
  onBack: () => void
}

export function VideoPlayer({ chapter, onBack }: VideoPlayerProps) {
  const { language } = useLanguageStore()
  const isArabic = language === 'ar'
  
  // Extract video ID from YouTube URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }
  
  const videoId = getYoutubeVideoId(chapter.youtubeUrl)
  
  if (!videoId) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-destructive">Invalid YouTube URL</p>
        <Button onClick={onBack} variant="ghost" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isArabic ? 'العودة إلى الفصول' : 'Back to chapters'}
        </Button>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col space-y-4">
      <Button onClick={onBack} variant="ghost" className={`self-start flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
        <ArrowLeft className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
        {isArabic ? 'العودة إلى الفصول' : 'Back to chapters'}
      </Button>
      
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={isArabic && chapter.titleAr ? chapter.titleAr : chapter.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mt-4">
          {isArabic && chapter.titleAr ? chapter.titleAr : chapter.title}
        </h2>
        <p className="text-muted-foreground mt-2">
          {isArabic && chapter.descriptionAr ? chapter.descriptionAr : chapter.description}
        </p>
      </div>
    </div>
  )
}
