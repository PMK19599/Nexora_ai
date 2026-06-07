import * as React from 'react';
import * as S from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
const Select = S.Root; const SelectGroup = S.Group; const SelectValue = S.Value;
const SelectTrigger = React.forwardRef<React.ComponentRef<typeof S.Trigger>, React.ComponentPropsWithoutRef<typeof S.Trigger>>(({ className, children, ...props }, ref) => (
  <S.Trigger ref={ref} className={cn('flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50', className)} {...props}>{children}<S.Icon asChild><svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></S.Icon></S.Trigger>
));
const SelectContent = React.forwardRef<React.ComponentRef<typeof S.Content>, React.ComponentPropsWithoutRef<typeof S.Content>>(({ className, children, position = 'popper', ...props }, ref) => (
  <S.Portal><S.Content ref={ref} className={cn('relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md', className)} position={position} {...props}><S.Viewport className="p-1">{children}</S.Viewport></S.Content></S.Portal>
));
const SelectItem = React.forwardRef<React.ComponentRef<typeof S.Item>, React.ComponentPropsWithoutRef<typeof S.Item>>(({ className, children, ...props }, ref) => (
  <S.Item ref={ref} className={cn('relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)} {...props}><span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"><S.ItemIndicator><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></S.ItemIndicator></span><S.ItemText>{children}</S.ItemText></S.Item>
));
SelectTrigger.displayName = S.Trigger.displayName; SelectContent.displayName = S.Content.displayName; SelectItem.displayName = S.Item.displayName;
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem };
