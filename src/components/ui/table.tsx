
import * as React from "react"
import { useLanguageStore } from "@/store/languageStore"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { forceDirection?: 'ltr' | 'rtl' }
>(({ className, forceDirection, ...props }, ref) => {
  const { language } = useLanguageStore();
  const dirClass = forceDirection || (language === 'ar' ? 'rtl' : 'ltr');
  
  return (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn(`w-full caption-bottom text-sm ${dirClass}`, className)}
        style={dirClass === 'ltr' ? { direction: 'ltr' } : { direction: 'rtl' }}
        {...props}
      />
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { language } = useLanguageStore();
  // Instead of trying to access ref from props, use a state variable
  const [textAlignClass, setTextAlignClass] = React.useState(language === 'ar' ? 'text-right' : 'text-left');
  
  // Try to find parent table element and determine direction
  const cellRef = React.useRef<HTMLTableCellElement | null>(null);
  
  React.useEffect(() => {
    // Search for parent table when component mounts
    const findParentTableDirection = () => {
      if (!cellRef.current) return;
      
      let element: HTMLElement | null = cellRef.current;
      while (element && element.tagName !== 'TABLE') {
        element = element.parentElement;
      }
      
      if (element) {
        if (element.classList.contains('rtl')) {
          setTextAlignClass('text-right');
        } else if (element.classList.contains('ltr')) {
          setTextAlignClass('text-left');
        } else {
          setTextAlignClass(language === 'ar' ? 'text-right' : 'text-left');
        }
      }
    };
    
    findParentTableDirection();
  }, [language]);
  
  // Use function that assigns to both refs
  const assignRefs = (el: HTMLTableCellElement | null) => {
    // assign to local ref
    cellRef.current = el;
    // forward the ref
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };
  
  return (
    <th
      ref={assignRefs}
      className={cn(
        `h-12 px-4 ${textAlignClass} align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0`,
        className
      )}
      {...props}
    />
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const { language } = useLanguageStore();
  // Instead of trying to access ref from props, use a state variable
  const [textAlignClass, setTextAlignClass] = React.useState(language === 'ar' ? 'text-right' : 'text-left');
  
  // Try to find parent table element and determine direction
  const cellRef = React.useRef<HTMLTableCellElement | null>(null);
  
  React.useEffect(() => {
    // Search for parent table when component mounts
    const findParentTableDirection = () => {
      if (!cellRef.current) return;
      
      let element: HTMLElement | null = cellRef.current;
      while (element && element.tagName !== 'TABLE') {
        element = element.parentElement;
      }
      
      if (element) {
        if (element.classList.contains('rtl')) {
          setTextAlignClass('text-right');
        } else if (element.classList.contains('ltr')) {
          setTextAlignClass('text-left');
        } else {
          setTextAlignClass(language === 'ar' ? 'text-right' : 'text-left');
        }
      }
    };
    
    findParentTableDirection();
  }, [language]);
  
  // Use function that assigns to both refs
  const assignRefs = (el: HTMLTableCellElement | null) => {
    // assign to local ref
    cellRef.current = el;
    // forward the ref
    if (typeof ref === 'function') {
      ref(el);
    } else if (ref) {
      ref.current = el;
    }
  };
  
  return (
    <td
      ref={assignRefs}
      className={cn(`p-4 ${textAlignClass} align-middle [&:has([role=checkbox])]:pr-0`, className)}
      {...props}
    />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
