import * as React from 'react';
import * as D from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
const Dialog = D.Root; const DialogTrigger = D.Trigger; const DialogClose = D.Close;
const DialogOverlay = React.forwardRef<React.ComponentRef<typeof D.Overlay>, React.ComponentPropsWithoutRef<typeof D.Overlay>>(({ className, ...props }, ref) => <D.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)} {...props} />);
const DialogContent = React.forwardRef<React.ComponentRef<typeof D.Content>, React.ComponentPropsWithoutRef<typeof D.Content>>(({ className, children, ...props }, ref) => (
  <D.Portal><DialogOverlay /><D.Content ref={ref} className={cn('fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg', className)} {...props}>{children}<D.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg><span className="sr-only">Close</span></D.Close></D.Content></D.Portal>
));
const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />;
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />;
const DialogTitle = React.forwardRef<React.ComponentRef<typeof D.Title>, React.ComponentPropsWithoutRef<typeof D.Title>>(({ className, ...props }, ref) => <D.Title ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />);
const DialogDescription = React.forwardRef<React.ComponentRef<typeof D.Description>, React.ComponentPropsWithoutRef<typeof D.Description>>(({ className, ...props }, ref) => <D.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />);
DialogOverlay.displayName = D.Overlay.displayName; DialogContent.displayName = D.Content.displayName; DialogTitle.displayName = D.Title.displayName; DialogDescription.displayName = D.Description.displayName;
export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
