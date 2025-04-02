
import React, { useState, useEffect } from "react";
import { ToastContext, ToasterToast, TOAST_REMOVE_DELAY } from "@/hooks/use-toast";

const TOAST_LIMIT = 20;

// Declare this on the window object
declare global {
  interface Window {
    __TOAST_CONTEXT__: {
      addToast: (toast: Omit<ToasterToast, "id">) => string;
      updateToast: (id: string, toast: Partial<ToasterToast>) => void;
      dismissToast: (id: string) => void;
      removeToast: (id: string) => void;
    };
  }
}

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
  
  // Expose the context to window object for non-component usage
  useEffect(() => {
    window.__TOAST_CONTEXT__ = {
      addToast,
      updateToast,
      dismissToast,
      removeToast
    };
    
    return () => {
      delete window.__TOAST_CONTEXT__;
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
