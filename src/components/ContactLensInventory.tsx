import React, { useState, useEffect } from "react";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { ContactLensCard } from "./contact-lens/ContactLensCard";
import { ContactLensForm } from "./contact-lens/ContactLensForm";
import { CustomBrandsManager } from "./contact-lens/CustomBrandsManager";
import { CustomTypesManager } from "./contact-lens/CustomTypesManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Contact,
  Settings,
  Tag,
  Database,
  UploadCloud,
  Filter,
  RefreshCw,
} from "lucide-react";
import { ContactLens } from "@/integrations/supabase/schema";
import * as contactLensService from "@/services/contactLensService";

const bellaContactLenses = [
  // Contour collection
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Contour - Contour Gray | كونتور - كونتور جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Contour - Contour Green | كونتور - كونتور جرين",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Contour - Contour Hazel | كونتور - كونتور هيزل",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Contour - Platinum Gray | كونتور - بلاتينيوم جراي",
  },

  // Diamond collection
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Agate Brown | دايموند - أجات براون",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Allure Blonde | دايموند - ألور بلوند",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Almond Gray | دايموند - ألموند جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Bluish Gray | دايموند - بلوش جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Brown Shadow | دايموند - براون شادو",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Citrine Crystal | دايموند - سترين كريستال",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Glitter Gray | دايموند - جليتر جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Gray Green | دايموند - جراي جرين",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Gray Shadow | دايموند - جراي شادو",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Hazel Beige | دايموند - هيزل بيج",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Hazel Honey | دايموند - هيزل هني",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Husky Gray Green | دايموند - هسكي جراي جرين",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Jade Green | دايموند - جيد جرين",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Lime Green | دايموند - لايم جرين",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Moon Stone | دايموند - مون ستون",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Mysterious | دايموند - مستيريوس",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Navy Gray | دايموند - نيفي جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Nay | دايموند - ناي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Oak | دايموند - أوك",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Ocean Blue | دايموند - أوشن بلو",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Pine | دايموند - باين",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Rosewood | دايموند - روزوود",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Saturn | دايموند - ساترن",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Silky Green | دايموند - سيلكي جرين",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Silver Mist | دايموند - سيلفر ميست",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Viola Gray | دايموند - فيولا جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Wild Honey | دايموند - وايلد هني",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Wood Leaf | دايموند - وود ليف",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - Wood Stone | دايموند - وود ستون",
  },

  // Elite collection
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Amber Gray | إيليت - أمبر جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Cinnamon Brown | إيليت - سينامون براون",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Cloudy Gray | إيليت - كلاودي جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Crystal N | إيليت - كريستال إن",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Emerald Green | إيليت - إميرالد جرين",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Gray Beige | إيليت - جراي بيج",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Gray Olive | إيليت - جراي أوليف",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Green Olive | إيليت - جرين أوليف",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Lavender Gray | إيليت - لافندر جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Matt Olive | إيليت - مات أوليف",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Midnight Blue | إيليت - ميدنايت بلو",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Mint Gray | إيليت - مينت جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Sandy Brown | إيليت - ساندي براون",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Sandy Gray | إيليت - ساندي جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Silky Gold | إيليت - سيلكي جولد",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Elite - Silky Gray | إيليت - سيلكي جراي",
  },

  // Glow collection
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Glow - Glow Radiant Hazelnut | جلو - جلو رادينت هيزلنَت",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Glow - Gray Caramel | جلو - جراي كراميل",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Glow - Radiant Brown | جلو - رادينت براون",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Glow - Radiant Gray | جلو - رادينت جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Glow - Radiant Hazelnut | جلو - رادينت هيزلنَت",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Glow - Vivid Blue | جلو - فيفيد بلو",
  },

  // Highlight collection
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Highlight - Circle Brown | هايلايت - سيركل براون",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Highlight - Circle Gray | هايلايت - سيركل جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Highlight - Highlight Cool Gray | هايلايت - هايلايت كوول جراي",
  },

  // Natural collection
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Natural - Marengo | ناتشورال - مارينجو",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Natural - Natural Cool Gray | ناتشورال - ناتشورال كوول جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Natural - Natural Gray | ناتشورال - ناتشورال جراي",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Natural - Natural Gray Blue | ناتشورال - ناتشورال جراي بلو",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Natural - Natural Green Yellow | ناتشورال - ناتشورال جرين ييلو",
  },

  // One Day collection (daily)
  {
    brand: "Bella",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color:
      "One Day - Almond Brown (Daily Disposable) | وَن داي - ألموند براون (يومي)",
  },
  {
    brand: "Bella",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "One Day - Ash Brown (Daily Disposable) | وَن داي - آش براون (يومي)",
  },
  {
    brand: "Bella",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "One Day - Cedar (Daily Disposable) | وَن داي - سيدار (يومي)",
  },
  {
    brand: "Bella",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "One Day - Cove (Daily Disposable) | وَن داي - كوف (يومي)",
  },
  {
    brand: "Bella",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "One Day - Earth (Daily Disposable) | وَن داي - إيرث (يومي)",
  },
  {
    brand: "Bella",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "One Day - Mars (Daily Disposable) | وَن داي - مارس (يومي)",
  },
  {
    brand: "Bella",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "One Day - Moon (Daily Disposable) | وَن داي - مون (يومي)",
  },
  {
    brand: "Bella",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "One Day - Star (Daily Disposable) | وَن داي - ستار (يومي)",
  },
  {
    brand: "Bella",
    type: "Daily",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "One Day - Venus (Daily Disposable) | وَن داي - فينوس (يومي)",
  },

  // Snow White collection
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Snow White - Snow White Black | سنو وايت - سنو وايت بلاك",
  },
  {
    brand: "Bella",
    type: "Monthly",
    bc: "8.5",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color:
      "Snow White - Snow White Satin Gray | سنو وايت - سنو وايت ساتِن جراي",
  },
];

const mBellaContactLenses = bellaContactLenses.map((lens) => ({
  ...lens,
  brand: "M-Bella",
}));

const dahabMonthlyAndDailies = [
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Lumirere Blue - لوميرير بلو",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Lumirere Hazel - لوميرير هيزل",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Lumirere Gray - لوميرير جراي",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Solitaire - سوليتير",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Sabrin Gray Green - سابرين جراي جرين",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Sabrin Gray - سابرين جراي",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Swarovski - سواروفسكي",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Sun Kiss - صن كيس",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - دايموند",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Topaz - توباز",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Sky - سكاي",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Cat Eye - كات آي",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Creamy - كريمي",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Lumirere Green - لوميرير جرين",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Lumirere Brown - لوميرير براون",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Ice - آيس",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Aqua - أكوا",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Caramel - كراميل",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Tiffany Blue - تيفاني بلو",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Hind - هند",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Natural Blue - ناتشورال بلو",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Perle - بيرل",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Mentha - منثا",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Rain - رين",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Alaska - ألاسكا",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Sabrin Soul - سابرين سول",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Medusa - ميدوسا",
  },

  // Daily versions of the same colors
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Lumirere Blue - لوميرير بلو",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Lumirere Hazel - لوميرير هيزل",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Lumirere Gray - لوميرير جراي",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Solitaire - سوليتير",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Sabrin Gray Green - سابرين جراي جرين",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Sabrin Gray - سابرين جراي",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Swarovski - سواروفسكي",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Sun Kiss - صن كيس",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Diamond - دايموند",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Topaz - توباز",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Sky - سكاي",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Cat Eye - كات آي",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Creamy - كريمي",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Lumirere Green - لوميرير جرين",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Lumirere Brown - لوميرير براون",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Ice - آيس",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Aqua - أكوا",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Caramel - كراميل",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Tiffany Blue - تيفاني بلو",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Hind - هند",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Natural Blue - ناتشورال بلو",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Perle - بيرل",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Mentha - منثا",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Rain - رين",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Alaska - ألاسكا",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Sabrin Soul - سابرين سول",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Medusa - ميدوسا",
  },
];

const dahabMonthlyOnly = [
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Kaf - كاف",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Smokey - سموكي",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Marbel - ماربل",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Natural Hazel - ناتشورال هيزل",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Natural Gray - ناتشورال جراي",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Natural Green - ناتشورال جرين",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Cappuccino - كابتشينو",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Honey - هوني",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Argan - أرغان",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Hawaii - هاواي",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Olive - أوليف",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Khaki - خاكي",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Grayish - جريش",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Brownish - براونش",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Brown - براون",
  },
  {
    brand: "Dahab",
    type: "Monthly",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Black - بلاك",
  },
];

const dahabDailiesOnly = [
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Daily Mix - ديلي ميكس",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Marron - مارون",
  },
  {
    brand: "Dahab",
    type: "Daily",
    bc: "8.4",
    diameter: "14.2",
    power: "-2.00",
    price: 14,
    qty: 10,
    color: "Daily Mix 2 - ديلي ميكس 2",
  },
];

const dahabContactLenses = [
  ...dahabMonthlyAndDailies,
  ...dahabMonthlyOnly,
  ...dahabDailiesOnly,
];

const allContactLenses = [
  ...bellaContactLenses,
  ...mBellaContactLenses,
  ...dahabContactLenses,
];

export interface ContactLensItem
  extends Omit<ContactLens, "contact_lens_id" | "created_at" | "updated_at"> {
  id: string;
}

export const ContactLensInventory: React.FC = () => {
  const [contactLenses, setContactLenses] = useState<ContactLensItem[]>([]);
  const { language } = useLanguageStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ContactLensItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [editingLens, setEditingLens] = useState<ContactLensItem | null>(null);
  const [deletingLensId, setDeletingLensId] = useState<string | null>(null);
  const [activeManageTab, setActiveManageTab] = useState<"brands" | "types">(
    "brands"
  );
  const [isLoading, setIsLoading] = useState(true);

  const [savedCustomBrands, setSavedCustomBrands] = useState<string[]>(() => {
    const saved = localStorage.getItem("customBrands");
    return saved ? JSON.parse(saved) : [];
  });

  const [savedCustomTypes, setSavedCustomTypes] = useState<string[]>(() => {
    const saved = localStorage.getItem("customTypes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("customBrands", JSON.stringify(savedCustomBrands));
  }, [savedCustomBrands]);

  useEffect(() => {
    localStorage.setItem("customTypes", JSON.stringify(savedCustomTypes));
  }, [savedCustomTypes]);

  const [filterBrand, setFilterBrand] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterColor, setFilterColor] = useState<string>("all");

  // Fetch contact lenses from the database
  useEffect(() => {
    fetchContactLenses();
  }, []);

  const fetchContactLenses = async () => {
    setIsLoading(true);
    try {
      const data = await contactLensService.getAllContactLenses();
      const formattedData = data.map((lens) => ({
        id: lens.contact_lens_id,
        brand: lens.brand,
        type: lens.type,
        bc: lens.bc,
        diameter: lens.diameter,
        power: lens.power,
        price: lens.price,
        qty: lens.qty,
        color: lens.color || undefined,
      }));
      setContactLenses(formattedData);
      setSearchResults(formattedData);
    } catch (error) {
      console.error("Error fetching contact lenses:", error);
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء جلب بيانات العدسات اللاصقة"
          : "Error fetching contact lenses data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const brands = [...new Set(contactLenses.map((lens) => lens.brand))].sort();
  const types = [...new Set(contactLenses.map((lens) => lens.type))].sort();
  const colors = [
    ...new Set(contactLenses.map((lens) => lens.color).filter(Boolean)),
  ].sort();

  useEffect(() => {
    handleSearch();
  }, [searchTerm, filterBrand, filterType, filterColor, contactLenses]);

  const handleSearch = () => {
    let results = [...contactLenses];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      results = results.filter(
        (lens) =>
          lens.brand.toLowerCase().includes(lowercasedTerm) ||
          lens.type.toLowerCase().includes(lowercasedTerm) ||
          lens.bc.toLowerCase().includes(lowercasedTerm) ||
          lens.diameter.toLowerCase().includes(lowercasedTerm) ||
          lens.power.toLowerCase().includes(lowercasedTerm) ||
          (lens.color && lens.color.toLowerCase().includes(lowercasedTerm))
      );
    }

    if (filterBrand && filterBrand !== "all") {
      results = results.filter((lens) => lens.brand === filterBrand);
    }

    if (filterType && filterType !== "all") {
      results = results.filter((lens) => lens.type === filterType);
    }

    if (filterColor && filterColor !== "all") {
      results = results.filter((lens) => lens.color === filterColor);
    }

    setSearchResults(results);

    if (
      results.length === 0 &&
      (searchTerm ||
        filterBrand !== "all" ||
        filterType !== "all" ||
        filterColor !== "all")
    ) {
      toast.info(
        language === "ar"
          ? "لم يتم العثور على عدسات لاصقة مطابقة للبحث."
          : "No matching contact lenses were found."
      );
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilterBrand("all");
    setFilterType("all");
    setFilterColor("all");
    setSearchResults(contactLenses);
  };

  const handleFormSubmit = async (lensData: Omit<ContactLensItem, "id">) => {
    if (
      lensData.brand &&
      ![
        "Acuvue",
        "Air Optix",
        "Biofinty",
        "Bella",
        "FreshLook",
        "PureVision",
        "SofLens",
      ].includes(lensData.brand) &&
      !savedCustomBrands.includes(lensData.brand)
    ) {
      setSavedCustomBrands((prev) => [...prev, lensData.brand]);
    }

    if (
      lensData.type &&
      !["Daily", "Monthly", "Biweekly", "Yearly", "Color"].includes(
        lensData.type
      ) &&
      !savedCustomTypes.includes(lensData.type)
    ) {
      setSavedCustomTypes((prev) => [...prev, lensData.type]);
    }

    try {
      if (editingLens) {
        await contactLensService.updateContactLens(editingLens.id, {
          brand: lensData.brand,
          type: lensData.type,
          bc: lensData.bc,
          diameter: lensData.diameter,
          power: lensData.power,
          price: lensData.price,
          qty: lensData.qty,
          color: lensData.color || null,
        });

        toast.success(
          language === "ar"
            ? `تم تحديث العدسة اللاصقة بنجاح: ${lensData.brand} ${lensData.type}`
            : `Successfully updated contact lens: ${lensData.brand} ${lensData.type}`
        );

        // Update local state
        setContactLenses((prev) =>
          prev.map((lens) =>
            lens.id === editingLens.id
              ? { ...lensData, id: editingLens.id }
              : lens
          )
        );
      } else {
        const newId = await contactLensService.addContactLens({
          brand: lensData.brand,
          type: lensData.type,
          bc: lensData.bc,
          diameter: lensData.diameter,
          power: lensData.power,
          price: lensData.price,
          qty: lensData.qty,
          color: lensData.color || null,
        });

        toast.success(
          language === "ar"
            ? `تم إضافة العدسة اللاصقة بنجاح: ${lensData.brand} ${lensData.type}`
            : `Successfully added contact lens: ${lensData.brand} ${lensData.type}`
        );

        // Add to local state
        setContactLenses((prev) => [...prev, { ...lensData, id: newId }]);
      }

      closeDialog();
    } catch (error) {
      console.error("Error saving contact lens:", error);
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء حفظ بيانات العدسة اللاصقة"
          : "Error saving contact lens data"
      );
    }
  };

  const handleEditLens = (lens: ContactLensItem) => {
    setEditingLens(lens);
    setIsAddDialogOpen(true);
  };

  const handleDeleteLens = (id: string) => {
    setDeletingLensId(id);
  };

  const confirmDeleteLens = async () => {
    if (deletingLensId) {
      try {
        const lensToDelete = contactLenses.find(
          (lens) => lens.id === deletingLensId
        );
        await contactLensService.deleteContactLens(deletingLensId);

        // Update local state
        setContactLenses((prev) =>
          prev.filter((lens) => lens.id !== deletingLensId)
        );
        setSearchResults((prev) =>
          prev.filter((lens) => lens.id !== deletingLensId)
        );

        toast.success(
          language === "ar"
            ? `تم حذف العدسة اللاصقة بنجاح: ${lensToDelete?.brand} ${lensToDelete?.type}`
            : `Successfully deleted contact lens: ${lensToDelete?.brand} ${lensToDelete?.type}`
        );
      } catch (error) {
        console.error("Error deleting contact lens:", error);
        toast.error(
          language === "ar"
            ? "حدث خطأ أثناء حذف العدسة اللاصقة"
            : "Error deleting contact lens"
        );
      } finally {
        setDeletingLensId(null);
      }
    }
  };

  const handleAddCustomBrand = (brand: string) => {
    setSavedCustomBrands((prev) => [...prev, brand]);
  };

  const handleDeleteCustomBrand = (brand: string) => {
    const brandInUse = contactLenses.some((lens) => lens.brand === brand);
    if (brandInUse) {
      toast.error(
        language === "ar"
          ? `لا يمكن حذف البراند "${brand}" لأنه مستخدم في عدسات لاصقة موجودة`
          : `Cannot delete brand "${brand}" as it is used in existing contact lenses`
      );
      return;
    }
    setSavedCustomBrands((prev) => prev.filter((b) => b !== brand));
  };

  const handleAddCustomType = (type: string) => {
    setSavedCustomTypes((prev) => [...prev, type]);
  };

  const handleDeleteCustomType = (type: string) => {
    const typeInUse = contactLenses.some((lens) => lens.type === type);
    if (typeInUse) {
      toast.error(
        language === "ar"
          ? `لا يمكن حذف النوع "${type}" لأنه مستخدم في عدسات لاصقة موجودة`
          : `Cannot delete type "${type}" as it is used in existing contact lenses`
      );
      return;
    }
    setSavedCustomTypes((prev) => prev.filter((t) => t !== type));
  };

  const closeDialog = () => {
    setIsAddDialogOpen(false);
    setEditingLens(null);
  };

  const groupedByBrand = React.useMemo(() => {
    const grouped: Record<string, ContactLensItem[]> = {};

    searchResults.forEach((lens) => {
      if (!grouped[lens.brand]) {
        grouped[lens.brand] = [];
      }
      grouped[lens.brand].push(lens);
    });

    return grouped;
  }, [searchResults]);

  const textDirection = language === "ar" ? "rtl" : "ltr";

  const handleBulkImport = async () => {
    try {
      // First, remove all existing Bella, M-Bella, and Dahab lenses to avoid duplicates
      const existingLenses = contactLenses.filter(
        (lens) =>
          lens.brand === "Bella" ||
          lens.brand === "M-Bella" ||
          lens.brand === "Dahab"
      );

      // Delete all existing lenses of these brands
      for (const lens of existingLenses) {
        await contactLensService.deleteContactLens(lens.id);
      }

      // Prepare the data for import
      const importData = allContactLenses.map((lens) => ({
        brand: lens.brand,
        type: lens.type,
        bc: lens.bc,
        diameter: lens.diameter,
        power: lens.power,
        price: lens.price,
        qty: lens.qty,
        color: lens.color || null,
      }));

      // Import all new lenses
      const importedCount = await contactLensService.bulkImportContactLenses(
        importData
      );

      // Refresh the data
      await fetchContactLenses();

      toast.success(
        language === "ar"
          ? `تم استيراد ${importedCount} عدسات لاصقة بنجاح`
          : `Successfully imported ${importedCount} contact lenses`
      );
    } catch (error) {
      console.error("Error during bulk import:", error);
      toast.error(
        language === "ar"
          ? "حدث خطأ أثناء استيراد بيانات العدسات اللاصقة"
          : "Error importing contact lenses data"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={textDirection}>
      <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === "ar"
                  ? "البحث عن عدسة لاصقة (ماركة، نوع، لون، قطر...)"
                  : "Search contact lenses (brand, type, color, diameter...)"
              }
              className="pl-9 w-full"
            />
          </div>
          <Button variant="outline" onClick={resetFilters} className="shrink-0">
            <RefreshCw className="h-4 w-4 mr-1" />{" "}
            {language === "ar" ? "إعادة ضبط" : "Reset"}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={filterBrand} onValueChange={setFilterBrand}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue
                placeholder={
                  language === "ar" ? "اختر البراند" : "Select Brand"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === "ar" ? "كل البراندات" : "All Brands"}
              </SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue
                placeholder={language === "ar" ? "اختر النوع" : "Select Type"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === "ar" ? "كل الأنواع" : "All Types"}
              </SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterColor} onValueChange={setFilterColor}>
            <SelectTrigger className="w-52 bg-white">
              <SelectValue
                placeholder={language === "ar" ? "اختر اللون" : "Select Color"}
              />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">
                {language === "ar" ? "كل الألوان" : "All Colors"}
              </SelectItem>
              {colors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="shrink-0 bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />{" "}
            {language === "ar" ? "إضافة عدسة لاصقة" : "Add Contact Lens"}
          </Button>

          <Button
            variant="outline"
            className="shrink-0 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
            onClick={() => setIsManageDialogOpen(true)}
          >
            <Settings className="h-4 w-4 mr-1" />{" "}
            {language === "ar" ? "إدارة الخيارات" : "Manage Options"}
          </Button>

          <Button
            variant="outline"
            className="shrink-0 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
            onClick={handleBulkImport}
          >
            <Database className="h-4 w-4 mr-1" />{" "}
            {language === "ar" ? "استيراد بيانات العدسات" : "Import Lenses"}
          </Button>
        </div>
      </div>

      {searchResults.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedByBrand).map(([brand, lenses]) => (
            <CollapsibleCard
              key={brand}
              title={`${brand} (${lenses.length})`}
              defaultOpen={true}
              headerClassName="bg-gradient-to-r from-blue-50 to-blue-100"
              titleClassName="text-blue-800 font-medium flex items-center gap-2"
              contentClassName="p-4 bg-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lenses.map((lens) => (
                  <ContactLensCard
                    key={lens.id}
                    lens={lens}
                    onEdit={handleEditLens}
                    onDelete={handleDeleteLens}
                  />
                ))}
              </div>
            </CollapsibleCard>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg p-12 text-center">
          <Contact className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-1">
            {language === "ar" ? "لا توجد عدسات لاصقة" : "No Contact Lenses"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {language === "ar"
              ? "لم يتم العثور على عدسات لاصقة مطابقة للبحث."
              : "No matching contact lenses were found."}
          </p>
          <Button variant="outline" onClick={resetFilters}>
            {language === "ar"
              ? "عرض جميع العدسات اللاصقة"
              : "Show All Contact Lenses"}
          </Button>
        </div>
      )}

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLens
                ? language === "ar"
                  ? "تعديل عدسة لاصقة"
                  : "Edit Contact Lens"
                : language === "ar"
                ? "إضافة عدسة لاصقة جديدة"
                : "Add New Contact Lens"}
            </DialogTitle>
            <DialogDescription>
              {editingLens
                ? language === "ar"
                  ? "قم بتعديل بيانات العدسة اللاصقة"
                  : "Update the contact lens details"
                : language === "ar"
                ? "أدخل تفاصيل العدسة اللاصقة الجديدة لإضافتها إلى المخزون"
                : "Enter new contact lens details to add to inventory"}
            </DialogDescription>
          </DialogHeader>

          <ContactLensForm
            onSubmit={handleFormSubmit}
            onCancel={closeDialog}
            initialValues={editingLens || {}}
            savedCustomBrands={savedCustomBrands}
            savedCustomTypes={savedCustomTypes}
            isEditing={!!editingLens}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {language === "ar"
                ? "إدارة البراندات والأنواع"
                : "Manage Brands & Types"}
            </DialogTitle>
            <DialogDescription>
              {language === "ar"
                ? "أضف أو احذف البراندات والأنواع المخصصة من هذه القائمة"
                : "Add or remove custom brands and types from this list"}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeManageTab}
            onValueChange={(value) =>
              setActiveManageTab(value as "brands" | "types")
            }
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="brands" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {language === "ar" ? "البراندات" : "Brands"}
              </TabsTrigger>
              <TabsTrigger value="types" className="flex items-center gap-2">
                <Contact className="h-4 w-4" />
                {language === "ar" ? "الأنواع" : "Types"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="brands" className="mt-0">
              <CustomBrandsManager
                savedBrands={savedCustomBrands}
                onSaveBrand={handleAddCustomBrand}
                onDeleteBrand={handleDeleteCustomBrand}
              />
            </TabsContent>

            <TabsContent value="types" className="mt-0">
              <CustomTypesManager
                savedTypes={savedCustomTypes}
                onSaveType={handleAddCustomType}
                onDeleteType={handleDeleteCustomType}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setIsManageDialogOpen(false)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {language === "ar" ? "تم" : "Done"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingLensId}
        onOpenChange={(open) => !open && setDeletingLensId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "ar" ? "تأكيد الحذف" : "Confirm Deletion"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "ar"
                ? "هل أنت متأكد أنك تريد حذف هذه العدسة اللاصقة؟ لا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you want to delete this contact lens? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "ar" ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLens}
              className="bg-destructive hover:bg-destructive/90"
            >
              {language === "ar" ? "حذف" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
