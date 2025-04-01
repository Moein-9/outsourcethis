
import React, { useState } from "react";
import { ToastContext } from "@/hooks/use-toast";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const TOAST_LIMIT = 20;

export function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  const addToast = (toast: Omit<ToasterToast, "id">): string => {
    const id = crypto.randomUUID();

    setToasts((prevToasts) => {
      const newToasts = [...prevToasts, { ...toast, id }];
      return newToasts.slice(-TOAST_LIMIT);
    });

    return id;
  };

  const updateToast = (id: string, toast: Partial<ToasterToast>) => {
    setToasts((prevToasts) => {
      const toastIndex = prevToasts.findIndex((t) => t.id === id);
      if (toastIndex >= 0) {
        const newToasts = [...prevToasts];
        newToasts[toastIndex] = { ...newToasts[toastIndex], ...toast };
        return newToasts;
      }
      return prevToasts;
    });
  };

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => {
      const toastIndex = prevToasts.findIndex((t) => t.id === id);
      if (toastIndex >= 0) {
        const newToasts = [...prevToasts];
        newToasts[toastIndex] = {
          ...newToasts[toastIndex],
          open: false,
        };
        return newToasts;
      }
      return prevToasts;
    });
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  };

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
  );
}
