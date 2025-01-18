// src/components/common/buttons/Button.tsx
import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-red-500 text-stone-50 shadow-sm hover:bg-red-500/90",
        outline:
          "border border-stone-200 bg-white shadow-sm hover:shadow-lime-300 hover:bg-stone-50 hover:text-stone-900 hover:border-lime-300",
        secondary:
          "bg-stone-100 text-stone-900 shadow-sm hover:bg-stone-100/80",
        ghost: "hover:bg-stone-100 hover:text-stone-900",
        link: "text-stone-900 underline-offset-4 hover:underline",
        basicLink: "text-stone-900 underline-offset-4 hover:underline bg-transparent hover:bg-transparent",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        link: "h-9 px-0 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <ShadcnButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-200 border-t-stone-800" />
            <span>Loading...</span>
          </div>
        ) : (
          props.children
        )}
      </ShadcnButton>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };