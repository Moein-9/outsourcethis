
import React from 'react';
import { cn } from '@/lib/utils';

interface FormErrorHighlightProps {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export const FormErrorHighlight: React.FC<FormErrorHighlightProps> = ({
  children,
  error,
  className,
}) => {
  return (
    <div className={className}>
      <div className={cn(
        "transition-all duration-200",
        error ? "ring-2 ring-red-500 bg-red-50" : ""
      )}>
        {children}
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};
