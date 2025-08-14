"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const MorphingDialog = DialogPrimitive.Root;

const MorphingDialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Trigger
    ref={ref}
    className={cn("cursor-pointer", className)}
    {...props}
  />
));
MorphingDialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

const MorphingDialogPortal = DialogPrimitive.Portal;

const MorphingDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
MorphingDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface MorphingDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  transition?: {
    type?: string;
    stiffness?: number;
    damping?: number;
    duration?: number;
  };
}

const MorphingDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  MorphingDialogContentProps
>(({ className, children, transition, ...props }, ref) => (
  <MorphingDialogPortal>
    <MorphingDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={transition || { type: "spring", stiffness: 200, damping: 24 }}
      >
        {children}
      </motion.div>
    </DialogPrimitive.Content>
  </MorphingDialogPortal>
));
MorphingDialogContent.displayName = DialogPrimitive.Content.displayName;

const MorphingDialogContainer = ({ children }: { children: React.ReactNode }) => (
  <AnimatePresence mode="wait">{children}</AnimatePresence>
);

const MorphingDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
MorphingDialogHeader.displayName = "MorphingDialogHeader";

const MorphingDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
MorphingDialogFooter.displayName = "MorphingDialogFooter";

const MorphingDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
MorphingDialogTitle.displayName = DialogPrimitive.Title.displayName;

const MorphingDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
MorphingDialogDescription.displayName = DialogPrimitive.Description.displayName;

const MorphingDialogSubtitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
MorphingDialogSubtitle.displayName = "MorphingDialogSubtitle";

interface MorphingDialogImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const MorphingDialogImage = React.forwardRef<
  HTMLImageElement,
  MorphingDialogImageProps
>(({ className, src, alt, ...props }, ref) => (
  <img
    ref={ref}
    src={src}
    alt={alt}
    className={cn("object-cover", className)}
    {...props}
  />
));
MorphingDialogImage.displayName = "MorphingDialogImage";

const MorphingDialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
));
MorphingDialogClose.displayName = DialogPrimitive.Close.displayName;

export {
  MorphingDialog,
  MorphingDialogPortal,
  MorphingDialogOverlay,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogContainer,
  MorphingDialogHeader,
  MorphingDialogFooter,
  MorphingDialogTitle,
  MorphingDialogDescription,
  MorphingDialogSubtitle,
  MorphingDialogImage,
  MorphingDialogClose,
};
