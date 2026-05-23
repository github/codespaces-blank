import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#8B1538] text-white hover:bg-[#6E0F2B]", // Carmesí
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-[var(--color-border-strong)] bg-transparent hover:bg-[var(--color-background-secondary)] text-[var(--color-text-primary)]",
        secondary: "bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)]",
        ghost: "hover:bg-[var(--color-background-secondary)] hover:text-[var(--color-text-primary)] text-[var(--color-text-secondary)]",
        link: "text-[#8B1538] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // We are simulating Radix UI Slot behavior without actually installing it
    // if `asChild` is needed later, we will install @radix-ui/react-slot
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
