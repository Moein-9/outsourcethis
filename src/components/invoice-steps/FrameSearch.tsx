import React, { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, Plus, PackageCheck, Loader2 } from "lucide-react";
import { searchFrames } from "@/services/frameService";
import type { Frame } from "@/integrations/supabase/schema";

interface FrameSearchProps {
  onFrameSelected: (frame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  }) => void;
  selectedFrame: {
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
  };
}

export const FrameSearch: React.FC<FrameSearchProps> = ({
  onFrameSelected,
  selectedFrame,
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === "ar";

  const [frameSearch, setFrameSearch] = useState("");
  const [frameResults, setFrameResults] = useState<Frame[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const textAlignClass = language === "ar" ? "text-right" : "text-left";
  const dirClass = language === "ar" ? "rtl" : "ltr";

  const handleFrameSearch = async () => {
    if (!frameSearch.trim()) {
      toast(t("searchTermError"));
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchFrames(frameSearch);
      setFrameResults(results);

      if (results.length === 0) {
        toast(t("noFramesFound"));
      }
    } catch (error) {
      console.error("Error searching frames:", error);
      toast.error(t("errorSearchingFrames") || "Error searching frames");
    } finally {
      setIsLoading(false);
    }
  };

  const selectFrame = (frame: Frame) => {
    const newFrame = {
      brand: frame.brand,
      model: frame.model,
      color: frame.color,
      size: frame.size,
      price: frame.price,
    };

    onFrameSelected(newFrame);
    setFrameResults([]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="frameSearchBox"
          className={`text-muted-foreground block ${textAlignClass}`}
        >
          {t("searchTerm")}
        </Label>
        <div
          className={`flex ${
            dirClass === "rtl" ? "space-x-2 space-x-reverse" : "space-x-2"
          }`}
        >
          <Input
            id="frameSearchBox"
            value={frameSearch}
            onChange={(e) => setFrameSearch(e.target.value)}
            placeholder={t("searchExample")}
            className={`flex-1 ${textAlignClass}`}
            onKeyDown={(e) => e.key === "Enter" && handleFrameSearch()}
          />
          <Button
            onClick={handleFrameSearch}
            className="gap-1"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {t("search")}
          </Button>
        </div>
      </div>

      {frameResults.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-2 border">{t("brand")}</th>
                <th className="p-2 border">{t("model")}</th>
                <th className="p-2 border">{t("color")}</th>
                <th className="p-2 border">{t("size")}</th>
                <th className="p-2 border">
                  {t("price")} ({t("kwd")})
                </th>
                <th className="p-2 border">{t("quantity")}</th>
                <th className="p-2 border"></th>
              </tr>
            </thead>
            <tbody>
              {frameResults.map((frame, index) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  <td className="p-2 border">{frame.brand}</td>
                  <td className="p-2 border">{frame.model}</td>
                  <td className="p-2 border">{frame.color}</td>
                  <td className="p-2 border">{frame.size}</td>
                  <td className="p-2 border">{frame.price.toFixed(2)}</td>
                  <td className="p-2 border">{frame.qty}</td>
                  <td className="p-2 border">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => selectFrame(frame)}
                      className="w-full"
                    >
                      <Plus
                        className={`w-4 h-4 ${
                          language === "ar" ? "ml-1" : "mr-1"
                        }`}
                      />
                      {t("choose")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedFrame.brand && (
        <div className="mt-4 p-3 border rounded-lg bg-amber-50/50 border-amber-200/70">
          <h4
            className={`font-medium text-amber-800 mb-2 flex items-center ${
              language === "ar" ? "justify-end" : "justify-start"
            }`}
          >
            <PackageCheck
              className={`w-4 h-4 ${
                language === "ar" ? "ml-1" : "mr-1"
              } text-amber-600`}
            />
            {t("selectedFrame")}
          </h4>
          <table className="w-full">
            <thead>
              <tr className="border-b border-amber-200/50">
                <th
                  className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}
                >
                  {t("brand")}
                </th>
                <th
                  className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}
                >
                  {t("model")}
                </th>
                <th
                  className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}
                >
                  {t("color")}
                </th>
                <th
                  className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}
                >
                  {t("size")}
                </th>
                <th
                  className={`p-1 ${textAlignClass} text-muted-foreground text-sm`}
                >
                  {t("price")} ({t("kwd")})
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={`p-1 ${textAlignClass}`}>
                  {selectedFrame.brand}
                </td>
                <td className={`p-1 ${textAlignClass}`}>
                  {selectedFrame.model}
                </td>
                <td className={`p-1 ${textAlignClass}`}>
                  {selectedFrame.color}
                </td>
                <td className={`p-1 ${textAlignClass}`}>
                  {selectedFrame.size}
                </td>
                <td className={`p-1 ${textAlignClass} font-medium`}>
                  {selectedFrame.price.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
