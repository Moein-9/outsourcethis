
import React, { useState, useEffect } from 'react';
import { useSupplierInvoiceStore, SupplierInvoice } from '@/store/supplierInvoiceStore';
import { useLanguageStore } from '@/store/languageStore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableFooter 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/utils/dateUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

// Helper function to create a utility file
<lov-write file_path="src/utils/dateUtils.ts">
export const formatDate = (dateString: string, locale: string = 'en-US') => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale);
};

export const getMonthName = (date: Date, locale: string = 'en-US') => {
  return date.toLocaleDateString(locale, { month: 'long' });
};

export const getYearMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return { year, month };
};

export const getMonthYearString = (date: Date, locale: string = 'en-US') => {
  const month = date.toLocaleDateString(locale, { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

export const filterByMonth = (items: any[], dateField: string, year: number, month: number) => {
  return items.filter(item => {
    const date = new Date(item[dateField]);
    return date.getFullYear() === year && date.getMonth() === month;
  });
};

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const generateMonthOptions = (locale: string = 'en-US'): { label: string; value: string }[] => {
  const options = [];
  const today = new Date();
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const label = date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    const value = `${year}-${month}`;
    
    options.push({ label, value });
  }
  
  return options;
};
