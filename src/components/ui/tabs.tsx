
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-14 items-center justify-center rounded-lg bg-gradient-to-r from-background/90 to-muted/90 px-1.5 py-1.5 text-muted-foreground shadow-sm border border-border/50",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-3 text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
      "data-[state=inactive]:bg-transparent data-[state=inactive]:hover:bg-accent/30 data-[state=inactive]:hover:text-accent-foreground",
      "data-[state=active]:bg-gradient-to-r data-[state=active]:shadow-md",
      // Default color scheme (indigo/purple) for general tabs
      "data-[state=active]:from-indigo-500/80 data-[state=active]:to-purple-500 data-[state=active]:text-primary-foreground",
      // Additional color applied by className if needed for specific tabs (e.g., green for contacts)
      "after:absolute after:content-[''] after:w-0 after:h-[2px] after:bg-accent-foreground after:left-1/2 after:-translate-x-1/2 after:bottom-1 after:transition-all after:duration-300 data-[state=inactive]:hover:after:w-1/2",
      "data-[state=inactive]:hover:scale-105 data-[state=active]:scale-105 transform transition-transform",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background animate-in fade-in-50 slide-in-from-bottom-3 duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
