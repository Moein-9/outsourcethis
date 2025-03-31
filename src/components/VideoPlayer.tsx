
import React from "react"
import { useLanguageStore } from "@/store/languageStore"
import { ArrowLeft, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TutorialChapter } from "./TutorialSection"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface VideoPlayerProps {
  chapter: TutorialChapter
  onBack: () => void
}

export function VideoPlayer({ chapter, onBack }: VideoPlayerProps) {
  const { language } = useLanguageStore()
  const isArabic = language === 'ar'
  
  // Extract video ID from YouTube URL
  const getYoutubeVideoId = (url: string) => {
    if (!url) return null
    
    // Handle both youtube.com and youtu.be URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }
  
  const videoId = getYoutubeVideoId(chapter.youtubeUrl)
  
  if (!videoId) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isArabic 
              ? 'رابط يوتيوب غير صالح. يرجى التحقق من عنوان URL ومحاولة مرة أخرى.'
              : 'Invalid YouTube URL. Please check the URL and try again.'}
          </AlertDescription>
        </Alert>
        <Button onClick={onBack} variant="ghost" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isArabic ? 'العودة إلى الفصول' : 'Back to chapters'}
        </Button>
      </div>
    )
  }
  
  // Create YouTube thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  
  return (
    <div className="flex flex-col space-y-4">
      <Button onClick={onBack} variant="ghost" className={`self-start flex items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
        <ArrowLeft className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
        {isArabic ? 'العودة إلى الفصول' : 'Back to chapters'}
      </Button>
      
      <div className="aspect-video w-full relative group">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={isArabic && chapter.titleAr ? chapter.titleAr : chapter.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg shadow-md"
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
