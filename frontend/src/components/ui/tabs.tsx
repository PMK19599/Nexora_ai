import * as React from 'react';
import * as T from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';
const Tabs = T.Root;
const TabsList = React.forwardRef<React.ComponentRef<typeof T.List>, React.ComponentPropsWithoutRef<typeof T.List>>(({ className, ...props }, ref) => <T.List ref={ref} className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className)} {...props} />);
const TabsTrigger = React.forwardRef<React.ComponentRef<typeof T.Trigger>, React.ComponentPropsWithoutRef<typeof T.Trigger>>(({ className, ...props }, ref) => <T.Trigger ref={ref} className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm', className)} {...props} />);
const TabsContent = React.forwardRef<React.ComponentRef<typeof T.Content>, React.ComponentPropsWithoutRef<typeof T.Content>>(({ className, ...props }, ref) => <T.Content ref={ref} className={cn('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)} {...props} />);
TabsList.displayName = T.List.displayName; TabsTrigger.displayName = T.Trigger.displayName; TabsContent.displayName = T.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent };
