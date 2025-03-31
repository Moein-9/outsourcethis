
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguageStore } from "@/store/languageStore";
import { toast } from "sonner";

interface DeleteOrderConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hasPaidAmount: boolean;
  amountPaid?: number;
}

export const DeleteOrderConfirmDialog: React.FC<DeleteOrderConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  hasPaidAmount,
  amountPaid
}) => {
  const { language, t } = useLanguageStore();
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            {language === 'ar' ? "تأكيد حذف الطلب" : "Confirm Order Deletion"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === 'ar' 
              ? "هل أنت متأكد من أنك تريد حذف هذا الطلب؟" 
              : "Are you sure you want to delete this order?"}
            
            {hasPaidAmount && amountPaid && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                {language === 'ar'
                  ? `سيتم استرداد المبلغ المدفوع (${amountPaid.toFixed(3)} د.ك) وإضافته كاسترداد في التقرير اليومي.`
                  : `The paid amount (${amountPaid.toFixed(3)} KWD) will be refunded and added as a refund in the daily report.`}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {language === 'ar' ? "إلغاء" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleConfirm}
          >
            {language === 'ar' ? "حذف الطلب" : "Delete Order"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
