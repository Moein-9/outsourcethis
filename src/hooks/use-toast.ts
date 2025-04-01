
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

// Create a standalone toast function that doesn't rely on hooks directly
// This allows it to be imported and used anywhere without violating React hooks rules
export const toast = {
  // Regular toast
  message: (props: Omit<ToasterToast, "id">) => {
    // When used outside components, this will add the toast via event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('toast-message', { detail: props });
      window.dispatchEvent(event);
      return "";
    }
    return "";
  },
  
  // Helper methods
  error: (message: string) => {
    if (typeof window !== 'undefined') {
      const props = { 
        title: "Error", 
        description: message, 
        variant: "destructive" as const 
      };
      const event = new CustomEvent('toast-message', { detail: props });
      window.dispatchEvent(event);
    }
    return "";
  },
  
  success: (message: string) => {
    if (typeof window !== 'undefined') {
      const props = { 
        title: "Success", 
        description: message 
      };
      const event = new CustomEvent('toast-message', { detail: props });
      window.dispatchEvent(event);
    }
    return "";
  }
};
