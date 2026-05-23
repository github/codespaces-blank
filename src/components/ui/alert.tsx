import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"
import { cn } from "./button"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] border-[var(--color-border-subtle)]",
        destructive:
          "border-[var(--color-state-danger)]/50 text-[var(--color-state-danger)] [&>svg]:text-[var(--color-state-danger)] bg-[var(--color-state-danger)]/5",
        success: 
          "border-[var(--color-state-success)]/50 text-[var(--color-state-success)] [&>svg]:text-[var(--color-state-success)] bg-[var(--color-state-success)]/5",
        info: 
          "border-[var(--color-state-info)]/50 text-[var(--color-state-info)] [&>svg]:text-[var(--color-state-info)] bg-[var(--color-state-info)]/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    let DefaultIcon = Info;
    if (variant === 'destructive') DefaultIcon = AlertCircle;
    if (variant === 'success') DefaultIcon = CheckCircle2;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon || <DefaultIcon className="h-4 w-4" />}
        {children}
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
