import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FrameSearch } from "./FrameSearch";
import { AddFrameForm } from "./AddFrameForm";
import { Glasses, Plus, Loader2 } from "lucide-react";
import { getAllFrames } from "@/services/frameService";
import { toast } from "sonner";

interface FrameSectionProps {
  selectedFrame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
  onFrameSelected: (frame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  }) => void;
}

export const FrameSection: React.FC<FrameSectionProps> = ({
  selectedFrame,
  onFrameSelected,
}) => {
  const { t, language } = useLanguageStore();
  const [showManualFrame, setShowManualFrame] = useState(false);
  const [isLoadingFrames, setIsLoadingFrames] = useState(false);
  const [frameCount, setFrameCount] = useState(0);

  // Fetch initial frame count on component mount
  useEffect(() => {
    const fetchFrameCount = async () => {
      setIsLoadingFrames(true);
      try {
        const frames = await getAllFrames();
        setFrameCount(frames.length);
      } catch (error) {
        console.error("Error fetching frames:", error);
      } finally {
        setIsLoadingFrames(false);
      }
    };

    fetchFrameCount();
  }, []);

  const handleFrameAdded = (frame: typeof selectedFrame) => {
    onFrameSelected(frame);
    setShowManualFrame(false);
    setFrameCount((prevCount) => prevCount + 1);
    toast.success(t("frameAddedSuccess") || "Frame added successfully");
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 border-b">
        <CardTitle
          className={`text-base flex items-center gap-2 text-amber-800`}
        >
          <Glasses className="w-4 h-4 text-amber-600" />
          {t("frameSection")}
          {isLoadingFrames ? (
            <Loader2 className="w-4 h-4 animate-spin ml-2 text-amber-500" />
          ) : (
            <span className="text-xs bg-amber-100 px-2 py-0.5 rounded-full text-amber-600 ml-2">
              {frameCount} {t("framesAvailable") || "frames available"}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <FrameSearch
            onFrameSelected={onFrameSelected}
            selectedFrame={selectedFrame}
          />

          <Button
            variant="outline"
            onClick={() => setShowManualFrame(!showManualFrame)}
            className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
          >
            <Plus
              className={`w-4 h-4 ${language === "ar" ? "ml-1" : "mr-1"}`}
            />
            {showManualFrame
              ? t("cancelAddFrame") || "Cancel"
              : t("addFrameButton") || "Add New Frame"}
          </Button>

          {showManualFrame && <AddFrameForm onFrameAdded={handleFrameAdded} />}
        </div>
      </CardContent>
    </Card>
  );
};
