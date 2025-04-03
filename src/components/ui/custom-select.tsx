
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  customValuePlaceholder?: string;
  id?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
  customValuePlaceholder = "Enter custom value",
  id,
  className,
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    // If the value is not in the options, it's a custom value
    if (value && !options.includes(value) && value !== "other") {
      setShowCustomInput(true);
      setCustomValue(value);
    } else {
      setShowCustomInput(value === "other");
    }
  }, [value, options]);

  const handleSelectChange = (newValue: string) => {
    if (newValue === "other") {
      setShowCustomInput(true);
      onChange("other");
    } else {
      setShowCustomInput(false);
      setCustomValue("");
      onChange(newValue);
    }
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCustomValue = e.target.value;
    setCustomValue(newCustomValue);
    
    // Only update parent component when we have a value
    if (newCustomValue.trim()) {
      onChange(newCustomValue);
    }
  };

  // Get the display value for the select
  const displayValue = () => {
    if (showCustomInput && value !== "other") {
      return value;
    }
    return value;
  };

  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Label htmlFor={selectId}>{label}</Label>
      <Select
        value={showCustomInput ? "other" : value}
        onValueChange={handleSelectChange}
      >
        <SelectTrigger id={selectId} className="w-full bg-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
          <SelectItem value="other">Other...</SelectItem>
        </SelectContent>
      </Select>

      {showCustomInput && (
        <Input
          value={customValue}
          onChange={handleCustomValueChange}
          placeholder={customValuePlaceholder}
          className="mt-2"
          autoFocus
        />
      )}
    </div>
  );
};
