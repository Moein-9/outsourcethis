
// Re-export the hooks from the correct location
import { useToast, toast, successToast, errorToast } from "@/hooks/use-toast";
import { ToastProvider } from "@/components/ui/toast-provider";

export { useToast, toast, successToast, errorToast, ToastProvider };
