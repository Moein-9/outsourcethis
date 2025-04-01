
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

// Additional export for compatibility
export const toast = (props: Omit<ToasterToast, "id">) => {
  const { toast } = useToast()
  return toast(props)
}
