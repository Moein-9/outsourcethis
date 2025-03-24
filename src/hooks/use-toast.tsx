
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import { useToast as useToastPrimitive } from "@/components/ui/use-toast";

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const useToast = useToastPrimitive;

export const toast = useToastPrimitive().toast;
