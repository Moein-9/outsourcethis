
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface CollapsibleCardProps {
  title: string;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function CollapsibleCard({
  title,
  defaultOpen = false,
  className,
  headerClassName,
  titleClassName,
  contentClassName,
  children
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader 
            className={cn(
              "bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg py-3 px-3 md:p-4 cursor-pointer hover:bg-gray-100 transition-all", 
              headerClassName
            )}
          >
            <div className="flex justify-between items-center">
              <CardTitle className={cn("text-gray-700 text-sm md:text-base", titleClassName)}>
                {title}
              </CardTitle>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className={cn("p-0 md:p-4", contentClassName)}>
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
