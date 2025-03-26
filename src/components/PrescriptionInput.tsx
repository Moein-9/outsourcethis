
import React, { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguageStore } from "@/store/languageStore";

interface PrescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  type: "sphere" | "cylinder" | "axis" | "add" | "pd";
  hasError?: boolean;
  readOnly?: boolean;
}

export const PrescriptionInput: React.FC<PrescriptionInputProps> = ({
  value,
  onChange,
  options,
  placeholder = "",
  type,
  hasError = false,
  readOnly = false
}) => {
  const { t } = useLanguageStore();
  const [inputMode, setInputMode] = useState<"dropdown" | "keyboard">("dropdown");
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleSelectChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  const handleInputBlur = () => {
    // Validate and format the input based on type
    let formattedValue = internalValue;
    
    if (type === "sphere" || type === "cylinder" || type === "add") {
      // Parse the number and format it with 2 decimal places
      const numValue = parseFloat(internalValue.replace(/[^\d.-]/g, ''));
      if (!isNaN(numValue)) {
        formattedValue = numValue >= 0 ? `+${numValue.toFixed(2)}` : numValue.toFixed(2);
      } else {
        formattedValue = "";
      }
    } else if (type === "axis") {
      // Parse the integer between 0 and 180
      const numValue = parseInt(internalValue.replace(/[^\d]/g, ''), 10);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 180) {
        formattedValue = numValue.toString();
      } else {
        formattedValue = "";
      }
    } else if (type === "pd") {
      // PD values should be between 15.0 and 40.0 in 0.5 increments
      const numValue = parseFloat(internalValue.replace(/[^\d.]/g, ''));
      if (!isNaN(numValue) && numValue >= 15.0 && numValue <= 40.0) {
        // Round to nearest 0.5
        const rounded = Math.round(numValue * 2) / 2;
        formattedValue = rounded.toString();
      } else {
        formattedValue = "";
      }
    }
    
    onChange(formattedValue);
    setInputMode("dropdown");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    }
  };

  const toggleInputMode = () => {
    if (readOnly) return;
    setInputMode(inputMode === "dropdown" ? "keyboard" : "dropdown");
    if (inputMode === "dropdown") {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  };

  const inputClasses = `
    w-full p-1 rounded-md text-sm bg-white
    ${hasError ? 'border-2 border-red-400' : 'border border-input'}
    ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}
  `;

  return (
    <div className="relative">
      {inputMode === "dropdown" ? (
        <Select
          disabled={readOnly}
          value={value || ""}
          onValueChange={handleSelectChange}
          onMouseDoubleClick={toggleInputMode}
        >
          <SelectTrigger 
            className={`h-8 px-2 py-0 ${hasError ? 'border-2 border-red-400' : ''}`}
          >
            <SelectValue placeholder={placeholder || t("choose")}>
              {value || " "}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          ref={inputRef}
          type="text"
          className={`h-8 px-2 py-0 ${inputClasses}`}
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t("enterValue")}
          readOnly={readOnly}
        />
      )}
      {!readOnly && (
        <button
          type="button"
          onClick={toggleInputMode}
          className="absolute inset-y-0 right-8 flex items-center px-1 text-gray-600 hover:text-gray-900"
          tabIndex={-1}
          aria-label={inputMode === "dropdown" ? "Switch to keyboard input" : "Switch to dropdown"}
        >
          <span className="text-xs">{inputMode === "dropdown" ? "✏️" : "▼"}</span>
        </button>
      )}
    </div>
  );
};

// Utility functions to generate options
export const generateSphereOptions = () => {
  const options: string[] = [];
  
  // Add positive values from +10.00 to +0.25
  for (let i = 10.00; i >= 0.25; i -= 0.25) {
    options.push(`+${i.toFixed(2)}`);
  }
  
  // Add 0.00
  options.push("0.00");
  
  // Add negative values from -0.25 to -10.00
  for (let i = -0.25; i >= -10.00; i -= 0.25) {
    options.push(i.toFixed(2));
  }
  
  return options;
};

export const generateCylinderOptions = () => {
  const options: string[] = [];
  
  // Start with 0.00
  options.push("0.00");
  
  // Add negative values from -0.25 to -6.00
  for (let i = -0.25; i >= -6.00; i -= 0.25) {
    options.push(i.toFixed(2));
  }
  
  return options;
};

export const generateAxisOptions = () => {
  const options: string[] = [];
  
  // Axis values from 0 to 180
  for (let i = 0; i <= 180; i += 1) {
    options.push(i.toString());
  }
  
  return options;
};

export const generateAddOptions = () => {
  const options: string[] = [];
  
  // ADD powers from 0.00 to +3.00
  for (let i = 0; i <= 3.00; i += 0.25) {
    options.push(i === 0 ? "0.00" : `+${i.toFixed(2)}`);
  }
  
  return options;
};

export const generatePDOptions = () => {
  const options: string[] = [];
  
  // PD values from 15.0 to 40.0 in 0.5 increments
  for (let i = 15.0; i <= 40.0; i += 0.5) {
    options.push(i.toString());
  }
  
  return options;
};
