
import React, { useState, useEffect } from "react";
import { ToastContext, ToasterToast, TOAST_REMOVE_DELAY } from "@/hooks/use-toast";

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

  // Listen for toast events from the global 'toast' object
  useEffect(() => {
    const handleToastMessage = (event: CustomEvent) => {
      addToast(event.detail);
    };

    window.addEventListener('toast-message', handleToastMessage as EventListener);
    
    return () => {
      window.removeEventListener('toast-message', handleToastMessage as EventListener);
    };
  }, []);

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
