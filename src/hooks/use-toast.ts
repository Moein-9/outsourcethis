import { useState, createContext, useContext } from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const TOAST_LIMIT = 20
const TOAST_REMOVE_DELAY = 1000

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

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  const addToast = (toast: Omit<ToasterToast, "id">): string => {
    const id = crypto.randomUUID()

    setToasts((prevToasts) => {
      const newToasts = [...prevToasts, { ...toast, id }]
      return newToasts.slice(-TOAST_LIMIT)
    })

    return id
  }

  const updateToast = (id: string, toast: Partial<ToasterToast>) => {
    setToasts((prevToasts) => {
      const toastIndex = prevToasts.findIndex((t) => t.id === id)
      if (toastIndex >= 0) {
        const newToasts = [...prevToasts]
        newToasts[toastIndex] = { ...newToasts[toastIndex], ...toast }
        return newToasts
      }
      return prevToasts
    })
  }

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => {
      const toastIndex = prevToasts.findIndex((t) => t.id === id)
      if (toastIndex >= 0) {
        const newToasts = [...prevToasts]
        newToasts[toastIndex] = {
          ...newToasts[toastIndex],
          open: false,
        }
        return newToasts
      }
      return prevToasts
    })
  }

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        updateToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

// Additional export for compatibility
export const toast = (props: Omit<ToasterToast, "id">) => {
  const { toast } = useToast()
  return toast(props)
}
