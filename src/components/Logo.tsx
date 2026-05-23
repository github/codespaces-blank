import { cn } from "./ui/button"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Placeholder SVG para el arco andalusí, estrella y libro */}
        <path d="M12 2L2 12H6V22H18V12H22L12 2Z" fill="currentColor" />
        <circle cx="12" cy="12" r="3" fill="var(--color-background-primary)" />
      </svg>
      <span className="font-serif text-lg font-medium tracking-tight">Iqra Al-Ándalus</span>
    </div>
  )
}
