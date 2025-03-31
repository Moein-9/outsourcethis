
import React, { useState } from "react"
import { HelpDialog } from "@/components/ui/help-dialog"
import { TutorialSection, TutorialChapter } from "@/components/TutorialSection"
import { VideoPlayer } from "@/components/VideoPlayer"
import { useLanguageStore } from "@/store/languageStore"

// Sample tutorial chapters data
const tutorialChapters: TutorialChapter[] = [
  {
    id: "getting-started",
    title: "Getting Started with Moen Optical",
    titleAr: "البدء مع نظام مؤمن للبصريات",
    description: "Learn the basics of the Moen Optical system and how to navigate the dashboard.",
    descriptionAr: "تعلم أساسيات نظام مؤمن للبصريات وكيفية التنقل في لوحة التحكم.",
    youtubeUrl: "https://www.youtube.com/watch?v=example1",
    duration: "5:20",
    category: "Basics"
  },
  {
    id: "create-client",
    title: "Creating a New Client Profile",
    titleAr: "إنشاء ملف عميل جديد",
    description: "Step-by-step guide to adding a new client to the system.",
    descriptionAr: "دليل خطوة بخطوة لإضافة عميل جديد إلى النظام.",
    youtubeUrl: "https://www.youtube.com/watch?v=example2",
    duration: "4:15",
    category: "Clients"
  },
  {
    id: "create-invoice",
    title: "Creating and Managing Invoices",
    titleAr: "إنشاء وإدارة الفواتير",
    description: "Learn how to create, edit and manage invoices for your clients.",
    descriptionAr: "تعلم كيفية إنشاء وتحرير وإدارة الفواتير لعملائك.",
    youtubeUrl: "https://www.youtube.com/watch?v=example3",
    duration: "8:45",
    category: "Billing"
  },
  {
    id: "inventory-management",
    title: "Inventory Management",
    titleAr: "إدارة المخزون",
    description: "How to track and manage your optical product inventory.",
    descriptionAr: "كيفية تتبع وإدارة مخزون منتجات البصريات الخاصة بك.",
    youtubeUrl: "https://www.youtube.com/watch?v=example4",
    duration: "7:30",
    category: "Inventory"
  },
  {
    id: "reports",
    title: "Generating Reports",
    titleAr: "إنشاء التقارير",
    description: "Learn how to create and analyze different reports for your business.",
    descriptionAr: "تعلم كيفية إنشاء وتحليل التقارير المختلفة لعملك.",
    youtubeUrl: "https://www.youtube.com/watch?v=example5",
    duration: "6:10",
    category: "Reports"
  },
  {
    id: "refunds",
    title: "Processing Refunds and Exchanges",
    titleAr: "معالجة المبالغ المستردة والتبادلات",
    description: "Complete guide to handling refunds and exchanges in the system.",
    descriptionAr: "دليل كامل للتعامل مع المبالغ المستردة والتبادلات في النظام.",
    youtubeUrl: "https://www.youtube.com/watch?v=example6",
    duration: "5:55",
    category: "Transactions"
  }
];

interface HelpCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpCenter({ open, onOpenChange }: HelpCenterProps) {
  const { t, language } = useLanguageStore();
  const [selectedChapter, setSelectedChapter] = useState<TutorialChapter | null>(null);
  
  const handleSelectChapter = (chapter: TutorialChapter) => {
    setSelectedChapter(chapter);
  };
  
  const handleBack = () => {
    setSelectedChapter(null);
  };
  
  return (
    <HelpDialog 
      open={open} 
      onOpenChange={(newOpen) => {
        // Reset selected chapter when closing the dialog
        if (!newOpen) setSelectedChapter(null);
        onOpenChange(newOpen);
      }}
      title={language === 'ar' ? "مركز المساعدة" : "Help Center"}
      description={
        language === 'ar' 
          ? "تصفح مقاطع الفيديو التعليمية لدينا لمعرفة كيفية استخدام النظام."
          : "Browse through our tutorial videos to learn how to use the system."
      }
    >
      {selectedChapter ? (
        <VideoPlayer chapter={selectedChapter} onBack={handleBack} />
      ) : (
        <TutorialSection 
          chapters={tutorialChapters} 
          onSelectChapter={handleSelectChapter} 
        />
      )}
    </HelpDialog>
  );
}
