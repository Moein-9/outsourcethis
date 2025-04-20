import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import {
  LensType,
  LensCoating,
  LensThickness,
  useInventoryStore,
} from "@/store/inventoryStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Check,
  X,
  Glasses,
  PanelTop,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LensSelectorProps {
  onSelectLensType: (lens: LensType | null) => void;
  onSelectCoating: (coating: LensCoating | null) => void;
  onSelectThickness: (thickness: LensThickness | null) => void;
  skipLens?: boolean;
  onSkipLensChange?: (skip: boolean) => void;
  initialLensType?: LensType | null;
  initialCoating?: LensCoating | null;
  initialThickness?: LensThickness | null;
  rx?: {
    sphere?: { right: string; left: string };
    cylinder?: { right: string; left: string };
    axis?: { right: string; left: string };
    add?: { right: string; left: string };
    pd?: { right: string; left: string };
    sphereOD?: string;
    sphereOS?: string;
    cylOD?: string;
    cylOS?: string;
    axisOD?: string;
    axisOS?: string;
    addOD?: string;
    addOS?: string;
    pdRight?: string;
    pdLeft?: string;
  };
  onCombinationPriceChange?: (price: number | null) => void;
  lensPricingCombinations?: PricingCombination[];
  isLoading?: boolean;
}

interface PricingCombination {
  combination_id: string;
  lens_type_id: string;
  coating_id: string;
  thickness_id: string;
  price: number;
  lens_types?: any;
  lens_coatings?: any;
  lens_thicknesses?: any;
}

export const LensSelector: React.FC<LensSelectorProps> = ({
  onSelectLensType,
  onSelectCoating,
  onSelectThickness,
  skipLens = false,
  onSkipLensChange,
  initialLensType = null,
  initialCoating = null,
  initialThickness = null,
  rx,
  onCombinationPriceChange,
  lensPricingCombinations: externalCombinations = [],
  isLoading: externalLoading = false,
}) => {
  const { t, language } = useLanguageStore();
  const isRtl = language === "ar";

  // State from the inventory store
  const {
    lensTypes: storeLensTypes,
    lensCoatings: storeLensCoatings,
    lensThicknesses: storeLensThicknesses,
    lensPricingCombinations: storePricingCombinations,
    isLoadingLensTypes,
    isLoadingLensCoatings,
    isLoadingLensThicknesses,
    isLoadingLensPricingCombinations,
  } = useInventoryStore();

  // Local state for component data
  const [lensTypes, setLensTypes] = useState<LensType[]>([]);
  const [lensCoatings, setLensCoatings] = useState<LensCoating[]>([]);
  const [lensThicknesses, setLensThicknesses] = useState<LensThickness[]>([]);
  const [pricingCombinations, setPricingCombinations] = useState<
    PricingCombination[]
  >([]);

  // Selection state
  const [selectedLensType, setSelectedLensType] = useState<LensType | null>(
    initialLensType
  );
  const [selectedCoating, setSelectedCoating] = useState<LensCoating | null>(
    initialCoating
  );
  const [selectedThickness, setSelectedThickness] =
    useState<LensThickness | null>(initialThickness);
  const [activeCategory, setActiveCategory] = useState<
    "distance-reading" | "progressive" | "bifocal"
  >("distance-reading");

  // Loading states
  const isLoadingAnyData =
    externalLoading ||
    isLoadingLensTypes ||
    isLoadingLensCoatings ||
    isLoadingLensThicknesses ||
    isLoadingLensPricingCombinations;

  // Use external pricing combinations if provided, otherwise use store data
  useEffect(() => {
    if (externalCombinations && externalCombinations.length > 0) {
      setPricingCombinations(externalCombinations);

      // Extract unique lens types from combinations
      const uniqueLensTypes = new Map();
      externalCombinations.forEach((item) => {
        const lens = item.lens_types;
        if (lens && !uniqueLensTypes.has(lens.lens_id)) {
          uniqueLensTypes.set(lens.lens_id, {
            id: lens.lens_id,
            name: lens.name,
            type: lens.type,
          });
        }
      });

      if (uniqueLensTypes.size > 0) {
        setLensTypes(Array.from(uniqueLensTypes.values()));
      }
    } else {
      // Use store data
      if (storePricingCombinations.length > 0) {
        // Convert store combinations to PricingCombination format
        const formattedCombinations = storePricingCombinations.map((combo) => ({
          combination_id: combo.id,
          lens_type_id: combo.lensTypeId,
          coating_id: combo.coatingId,
          thickness_id: combo.thicknessId,
          price: combo.price,
        }));
        setPricingCombinations(formattedCombinations);
      }

      if (storeLensTypes.length > 0) {
        setLensTypes(storeLensTypes);
      }
    }
  }, [externalCombinations, storePricingCombinations, storeLensTypes]);

  // Update local lensCoatings and lensThicknesses from store data when not using external combinations
  useEffect(() => {
    if (!externalCombinations || externalCombinations.length === 0) {
      if (storeLensCoatings.length > 0) {
        setLensCoatings(storeLensCoatings);
      }

      if (storeLensThicknesses.length > 0) {
        setLensThicknesses(storeLensThicknesses);
      }
    }
  }, [externalCombinations, storeLensCoatings, storeLensThicknesses]);

  const hasAddValues = React.useMemo(() => {
    if (!rx) return false;

    const isValidAddValue = (value?: string) => {
      if (!value) return false;
      if (
        value === "0" ||
        value === "0.00" ||
        value === "-" ||
        value === "0-" ||
        value.trim() === ""
      )
        return false;
      const numValue = parseFloat(value);
      return !isNaN(numValue) && numValue > 0;
    };

    if (rx.add) {
      return isValidAddValue(rx.add.right) || isValidAddValue(rx.add.left);
    }

    return isValidAddValue(rx.addOD) || isValidAddValue(rx.addOS);
  }, [rx]);

  const filteredLensTypes = React.useMemo(() => {
    if (hasAddValues) {
      return lensTypes;
    } else {
      return lensTypes.filter(
        (lens) => lens.type !== "progressive" && lens.type !== "bifocal"
      );
    }
  }, [lensTypes, hasAddValues]);

  const getCategory = (
    lensType: LensType | null
  ): "distance-reading" | "progressive" | "bifocal" => {
    if (!lensType) return "distance-reading";

    switch (lensType.type) {
      case "progressive":
        return "progressive";
      case "bifocal":
        return "bifocal";
      case "distance":
      case "reading":
      case "sunglasses":
      default:
        return "distance-reading";
    }
  };

  useEffect(() => {
    if (initialLensType) {
      if (
        !hasAddValues &&
        (initialLensType.type === "progressive" ||
          initialLensType.type === "bifocal")
      ) {
        setSelectedLensType(null);
        onSelectLensType(null);
      } else {
        setSelectedLensType(initialLensType);
        setActiveCategory(getCategory(initialLensType));
      }
    }
    if (initialCoating) {
      setSelectedCoating(initialCoating);
    }
    if (initialThickness) {
      setSelectedThickness(initialThickness);
    }
  }, [
    initialLensType,
    initialCoating,
    initialThickness,
    hasAddValues,
    onSelectLensType,
  ]);

  useEffect(() => {
    if (
      selectedLensType &&
      !hasAddValues &&
      (selectedLensType.type === "progressive" ||
        selectedLensType.type === "bifocal")
    ) {
      setSelectedLensType(null);
      onSelectLensType(null);

      setSelectedCoating(null);
      setSelectedThickness(null);
      onSelectCoating(null);
      onSelectThickness(null);
    }
  }, [
    hasAddValues,
    selectedLensType,
    onSelectLensType,
    onSelectCoating,
    onSelectThickness,
  ]);

  // Update available coatings when lens type changes
  useEffect(() => {
    if (selectedLensType && pricingCombinations.length > 0) {
      // Filter combinations to get available coatings for the selected lens type
      const availableCombinations = pricingCombinations.filter(
        (combo) => combo.lens_type_id === selectedLensType.id
      );

      if (externalCombinations && externalCombinations.length > 0) {
        // Extract unique coatings from the filtered combinations
        const uniqueCoatings = new Map();
        availableCombinations.forEach((combo) => {
          const coating = combo.lens_coatings;
          if (coating && !uniqueCoatings.has(coating.coating_id)) {
            uniqueCoatings.set(coating.coating_id, {
              id: coating.coating_id,
              name: coating.name,
              price: coating.price,
              description: coating.description,
              category: coating.category,
              isPhotochromic: coating.is_photochromic,
              availableColors: coating.available_colors,
            });
          }
        });

        setLensCoatings(Array.from(uniqueCoatings.values()));
      } else {
        // Use store coatings filtered by category
        const category = getCategory(selectedLensType);
        const filteredCoatings = storeLensCoatings.filter(
          (coating) => coating.category === category
        );
        setLensCoatings(filteredCoatings);
      }
    } else {
      setLensCoatings([]);
    }
  }, [
    selectedLensType,
    pricingCombinations,
    externalCombinations,
    storeLensCoatings,
  ]);

  // Update available thicknesses when coating changes
  useEffect(() => {
    if (selectedLensType && selectedCoating && pricingCombinations.length > 0) {
      // Filter combinations to get available thicknesses for the selected lens type and coating
      const availableCombinations = pricingCombinations.filter(
        (combo) =>
          combo.lens_type_id === selectedLensType.id &&
          combo.coating_id === selectedCoating.id
      );

      if (externalCombinations && externalCombinations.length > 0) {
        // Extract unique thicknesses from the filtered combinations
        const uniqueThicknesses = new Map();
        availableCombinations.forEach((combo) => {
          const thickness = combo.lens_thicknesses;
          if (thickness && !uniqueThicknesses.has(thickness.thickness_id)) {
            uniqueThicknesses.set(thickness.thickness_id, {
              id: thickness.thickness_id,
              name: thickness.name,
              price: thickness.price,
              description: thickness.description,
              category: thickness.category,
            });
          }
        });

        setLensThicknesses(Array.from(uniqueThicknesses.values()));
      } else {
        // Use store thicknesses filtered by category
        const category = getCategory(selectedLensType);
        const filteredThicknesses = storeLensThicknesses.filter(
          (thickness) => thickness.category === category
        );
        setLensThicknesses(filteredThicknesses);
      }
    } else {
      setLensThicknesses([]);
    }
  }, [
    selectedLensType,
    selectedCoating,
    pricingCombinations,
    externalCombinations,
    storeLensThicknesses,
  ]);

  // Get the final combination price when all three components are selected
  useEffect(() => {
    if (
      selectedLensType &&
      selectedCoating &&
      selectedThickness &&
      onCombinationPriceChange
    ) {
      // Find the matching combination in our cached data
      const matchingCombination = pricingCombinations.find(
        (combo) =>
          combo.lens_type_id === selectedLensType.id &&
          combo.coating_id === selectedCoating.id &&
          combo.thickness_id === selectedThickness.id
      );

      if (matchingCombination) {
        onCombinationPriceChange(matchingCombination.price);
      } else {
        // If not found in cache, use an alternative method to calculate price
        // This could be a fallback sum of individual component prices
        const totalPrice =
          (selectedLensType.price || 0) +
          (selectedCoating ? selectedCoating.price : 0) +
          (selectedThickness ? selectedThickness.price : 0);
        onCombinationPriceChange(totalPrice);

        // Inform the user that we're using an estimate
        toast.info(
          t("usingEstimatedPrice") ||
            "Using estimated price for this combination"
        );
      }
    } else if (onCombinationPriceChange) {
      onCombinationPriceChange(null);
    }
  }, [
    selectedLensType,
    selectedCoating,
    selectedThickness,
    onCombinationPriceChange,
    pricingCombinations,
    t,
  ]);

  // Handle lens type selection
  const handleLensTypeSelect = (lens: LensType) => {
    setSelectedLensType(lens);
    setSelectedCoating(null);
    setSelectedThickness(null);
    onSelectLensType(lens);
    onSelectCoating(null);
    onSelectThickness(null);
    setActiveCategory(getCategory(lens));
  };

  // Handle coating selection
  const handleCoatingSelect = (coating: LensCoating) => {
    setSelectedCoating(coating);
    setSelectedThickness(null);
    onSelectCoating(coating);
    onSelectThickness(null);
  };

  // Handle thickness selection
  const handleThicknessSelect = (thickness: LensThickness) => {
    setSelectedThickness(thickness);
    onSelectThickness(thickness);

    // Find the price for this combination
    if (selectedLensType && selectedCoating) {
      const matchingCombination = pricingCombinations.find(
        (combo) =>
          combo.lens_type_id === selectedLensType.id &&
          combo.coating_id === selectedCoating.id &&
          combo.thickness_id === thickness.id
      );

      if (matchingCombination && onCombinationPriceChange) {
        onCombinationPriceChange(matchingCombination.price);
      } else if (onCombinationPriceChange) {
        // If no matching combination, calculate default price by adding individual prices
        const defaultPrice =
          (selectedLensType.price || 0) +
          selectedCoating.price +
          thickness.price;
        onCombinationPriceChange(defaultPrice);
      }
    }
  };

  const handleSkipLensChange = (checked: boolean) => {
    if (onSkipLensChange) {
      onSkipLensChange(checked);
    }

    if (checked) {
      setSelectedLensType(null);
      setSelectedCoating(null);
      setSelectedThickness(null);
      onSelectLensType(null);
      onSelectCoating(null);
      onSelectThickness(null);

      if (onCombinationPriceChange) {
        onCombinationPriceChange(null);
      }
    }
  };

  const dirClass = language === "ar" ? "rtl" : "ltr";

  // Check if data is fully loaded for each component
  const isLensDataLoaded =
    !isLoadingLensTypes &&
    storeLensTypes.length > 0 &&
    !isLoadingLensCoatings &&
    storeLensCoatings.length > 0 &&
    !isLoadingLensThicknesses &&
    storeLensThicknesses.length > 0 &&
    !isLoadingLensPricingCombinations &&
    storePricingCombinations.length > 0;

  const isExternalDataLoaded =
    externalCombinations && externalCombinations.length > 0 && !externalLoading;

  const isDataLoaded = isExternalDataLoaded || isLensDataLoaded;

  if (skipLens) {
    return (
      <div className="border rounded-lg p-4 text-center bg-muted/20">
        <Glasses className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="text-muted-foreground font-medium">{t("frameOnly")}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => handleSkipLensChange(false)}
        >
          {t("addLens")}
        </Button>
      </div>
    );
  }

  // Show single global loading state when data is not yet loaded
  if (isLoadingAnyData || !isDataLoaded) {
    return (
      <div className="flex flex-col justify-center items-center py-8 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          {t("loadingLensOptions") || "Loading lens options..."}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${dirClass}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="skipLensCheck"
          checked={skipLens}
          onCheckedChange={(checked) => handleSkipLensChange(checked === true)}
        />
        <Label
          htmlFor="skipLensCheck"
          className={`font-medium text-sm flex items-center gap-1 ${
            language === "ar" ? "mr-2" : "ml-2"
          }`}
        >
          <Glasses className="w-4 h-4 text-amber-600" />
          {t("frameOnly")}
        </Label>
      </div>

      <Card>
        <CardContent className="p-4 pb-0">
          <div className="mb-3 flex items-center">
            <div className="bg-violet-100 p-1.5 rounded-md">
              <PanelTop className="w-4 h-4 text-violet-600" />
            </div>
            <h3 className="font-semibold text-violet-800 ml-2">
              1. {t("selectLensType")}
            </h3>
          </div>

          {isLoadingLensTypes ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {filteredLensTypes.length > 0 ? (
                filteredLensTypes.map((lens) => (
                  <Button
                    key={lens.id}
                    variant={
                      selectedLensType?.id === lens.id ? "default" : "outline"
                    }
                    className={`
                      h-auto py-2 px-3 justify-start text-left flex-col items-start gap-1
                      ${
                        selectedLensType?.id === lens.id
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "hover:bg-violet-50"
                      }
                    `}
                    onClick={() => handleLensTypeSelect(lens)}
                  >
                    <span className="font-medium">{lens.name}</span>
                    <span className="text-xs opacity-80">{lens.type}</span>
                    {selectedLensType?.id === lens.id && (
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white mt-1"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        {t("selected")}
                      </Badge>
                    )}
                  </Button>
                ))
              ) : (
                <div className="col-span-3 text-center py-3 text-muted-foreground">
                  {t("noLensTypesAvailable") || "No lens types available"}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 pb-0">
          <div className="mb-3 flex items-center">
            <div className="bg-orange-100 p-1.5 rounded-md">
              <PanelTop className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="font-semibold text-orange-800 ml-2">
              2. {t("selectCoating")}
            </h3>
          </div>

          {selectedLensType ? (
            isLoadingLensCoatings ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
              </div>
            ) : lensCoatings.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {lensCoatings.map((coating) => (
                  <Button
                    key={coating.id}
                    variant={
                      selectedCoating?.id === coating.id ? "default" : "outline"
                    }
                    className={`
                      h-auto py-2 px-3 justify-between text-left gap-2 flex-col items-start
                      ${
                        selectedCoating?.id === coating.id
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "hover:bg-orange-50"
                      }
                      ${
                        coating.isPhotochromic ? "border-blue-300 border-2" : ""
                      }
                    `}
                    onClick={() => handleCoatingSelect(coating)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{coating.name}</span>
                      <span className="text-xs opacity-80">
                        {coating.description}
                      </span>
                      {coating.isPhotochromic && (
                        <span className="text-xs mt-1 font-medium text-blue-600 dark:text-blue-400">
                          {t("photochromic")}
                        </span>
                      )}
                    </div>
                    <div
                      className={`w-full flex ${
                        selectedCoating?.id === coating.id
                          ? "justify-between"
                          : "justify-end"
                      } items-center`}
                    >
                      {selectedCoating?.id === coating.id && (
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          {t("selected")}
                        </Badge>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-orange-50/50 rounded-lg mb-3">
                <AlertCircle className="mx-auto h-8 w-8 text-orange-400 mb-2" />
                <p className="text-orange-800 font-medium">
                  {t("noCoatingsAvailable") ||
                    "No coating options available for this lens type."}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  {t("selectDifferentLens") ||
                    "Please select a different lens type."}
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-3 text-muted-foreground">
              {t("selectLensTypeFirst")}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 pb-0">
          <div className="mb-3 flex items-center">
            <div className="bg-emerald-100 p-1.5 rounded-md">
              <PanelTop className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-emerald-800 ml-2">
              3. {t("selectThickness") || "Select Thickness"}
            </h3>
          </div>

          {selectedLensType && selectedCoating ? (
            isLoadingLensThicknesses ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
              </div>
            ) : lensThicknesses.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {lensThicknesses.map((thickness) => (
                  <Button
                    key={thickness.id}
                    variant={
                      selectedThickness?.id === thickness.id
                        ? "default"
                        : "outline"
                    }
                    className={`
                      h-auto py-2 px-3 justify-between text-left gap-2 flex-col items-start
                      ${
                        selectedThickness?.id === thickness.id
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "hover:bg-emerald-50"
                      }
                    `}
                    onClick={() => handleThicknessSelect(thickness)}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{thickness.name}</span>
                      <span className="text-xs opacity-80">
                        {thickness.description}
                      </span>
                    </div>
                    <div
                      className={`w-full flex ${
                        selectedThickness?.id === thickness.id
                          ? "justify-between"
                          : "justify-end"
                      } items-center`}
                    >
                      {selectedThickness?.id === thickness.id && (
                        <Badge
                          variant="secondary"
                          className="bg-white/20 text-white"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          {t("selected")}
                        </Badge>
                      )}
                      <Badge
                        variant={
                          selectedThickness?.id === thickness.id
                            ? "outline"
                            : "secondary"
                        }
                        className={
                          selectedThickness?.id === thickness.id
                            ? "border-white/30 text-white"
                            : ""
                        }
                      >
                        {thickness.price.toFixed(2)} {t("kwd")}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 bg-emerald-50/50 rounded-lg mb-3">
                <AlertCircle className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
                <p className="text-emerald-800 font-medium">
                  {t("noThicknessAvailable") ||
                    "No thickness options available for this combination."}
                </p>
                <p className="text-sm text-emerald-600 mt-1">
                  {t("selectDifferentCoating") ||
                    "Please select a different coating."}
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-3 text-muted-foreground">
              {selectedLensType
                ? t("selectCoatingFirst") || "Select a coating first"
                : t("selectLensTypeFirst")}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
