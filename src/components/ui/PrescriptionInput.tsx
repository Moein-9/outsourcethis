
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface PrescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  isInvalid?: boolean;
  className?: string;
  id?: string;
}

export const PrescriptionInput: React.FC<PrescriptionInputProps> = ({
  value,
  onChange,
  options,
  placeholder = "",
  isInvalid = false,
  className = "",
  id
}) => {
  const [inputMode, setInputMode] = useState<"dropdown" | "keyboard">("dropdown");
  const [inputValue, setInputValue] = useState(value);
  
  // Sync with parent value
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };
  
  const handleModeToggle = () => {
    setInputMode(inputMode === "dropdown" ? "keyboard" : "dropdown");
  };
  
  const borderClass = isInvalid 
    ? "border-red-500 focus-visible:ring-red-500" 
    : "border-input";
  
  return (
    <div className="relative">
      {inputMode === "dropdown" ? (
        <select
          id={id}
          value={value}
          onChange={handleSelectChange}
          className={`w-full h-10 rounded-md ${borderClass} bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`${borderClass} ${className}`}
        />
      )}
      
      <button
        type="button"
        onClick={handleModeToggle}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-1 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
        title={inputMode === "dropdown" ? "Switch to keyboard input" : "Switch to dropdown"}
      >
        {inputMode === "dropdown" ? "⌨️" : "▼"}
      </button>
    </div>
  );
};
