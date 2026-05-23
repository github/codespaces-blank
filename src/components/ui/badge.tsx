import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./button"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-primary)]/80",
        secondary:
          "border-transparent bg-[var(--color-background-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-secondary)]/80",
        outline: "text-[var(--color-text-primary)] border-[var(--color-border-default)]",
        // Estados específicos de la app
        available: "border-transparent bg-[var(--color-status-available)]/10 text-[var(--color-status-available)]",
        borrowed: "border-transparent bg-[var(--color-status-borrowed)]/10 text-[var(--color-status-borrowed)]",
        reserved: "border-transparent bg-[var(--color-status-reserved)]/10 text-[var(--color-status-reserved)]",
        lost: "border-transparent bg-[var(--color-status-lost)]/10 text-[var(--color-status-lost)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
