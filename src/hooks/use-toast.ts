
import { createContext, useContext } from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const TOAST_LIMIT = 20
export const TOAST_REMOVE_DELAY = 1000

type ToastContextType = {
  toasts: ToasterToast[]
  addToast: (toast: Omit<ToasterToast, "id">) => string
  updateToast: (id: string, toast: Partial<ToasterToast>) => void
  dismissToast: (id: string) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => "",
  updateToast: () => {},
  dismissToast: () => {},
  removeToast: () => {},
})

export function useToast() {
  const { toasts, addToast, updateToast, dismissToast, removeToast } =
    useContext(ToastContext)

  return {
    toasts,
    toast: (props: Omit<ToasterToast, "id">) => addToast(props),
    update: (id: string, props: Partial<ToasterToast>) => updateToast(id, props),
    dismiss: (id: string) => dismissToast(id),
    remove: (id: string) => removeToast(id),
  }
}

// We can't directly export a function that uses hooks outside of components
// Create a properly memoized function for direct import usage
const toastFn = {
  success: (props: Omit<ToasterToast, "id">) => {
    // We're accessing window object to get the __TOAST_CONTEXT__ added by ToastProvider
    const toastContext = (window as any).__TOAST_CONTEXT__;
    if (toastContext) {
      return toastContext.addToast({ ...props, variant: "default" });
    }
    console.error("Toast context not available. Make sure ToastProvider is mounted.");
    return "";
  },
  error: (props: Omit<ToasterToast, "id">) => {
    const toastContext = (window as any).__TOAST_CONTEXT__;
    if (toastContext) {
      return toastContext.addToast({ ...props, variant: "destructive" });
    }
    console.error("Toast context not available. Make sure ToastProvider is mounted.");
    return "";
  },
  // Default toast function
  toast: (props: Omit<ToasterToast, "id">) => {
    const toastContext = (window as any).__TOAST_CONTEXT__;
    if (toastContext) {
      return toastContext.addToast(props);
    }
    console.error("Toast context not available. Make sure ToastProvider is mounted.");
    return "";
  }
};

export const toast = toastFn.toast;
export const successToast = toastFn.success;
export const errorToast = toastFn.error;
