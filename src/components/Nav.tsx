'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Logo } from "./Logo"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "./ui/button"

const PUBLIC_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/como-funciona", label: "Cómo funciona" },
  { href: "/donar", label: "Donar" },
  { href: "/transparencia", label: "Transparencia" },
]

export function Nav() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const [isOpen, setIsOpen] = useState(false)

  if (isAdminRoute) {
    return (
      <header className="sticky top-0 z-[var(--z-sticky)] w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-background-primary)]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[var(--container-xl)]">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Logo />
            <span className="rounded-full bg-[var(--color-accent-primary)] px-2 py-0.5 text-[10px] font-medium text-white uppercase tracking-wider">Admin</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin/prestamos" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Préstamos</Link>
            <Link href="/admin/catalogo" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Catálogo</Link>
            <Link href="/cuenta/prestamos" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Mi Cuenta</Link>
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-[var(--z-sticky)] w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-background-primary)]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[var(--container-xl)]">
        <Link href="/">
          <Logo />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {PUBLIC_LINKS.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[var(--color-accent-primary)]",
                pathname === link.href ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-secondary)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">Iniciar sesión</Button>
          </Link>
          <Link href="/registro">
            <Button className="font-medium">Mi cuenta</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-[var(--color-text-primary)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[var(--color-background-primary)] border-b border-[var(--color-border-subtle)] px-4 py-4 flex flex-col gap-4 shadow-lg">
          {PUBLIC_LINKS.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-base font-medium py-2 text-[var(--color-text-primary)]"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px w-full bg-[var(--color-border-subtle)] my-2" />
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button variant="outline" className="w-full justify-start">Iniciar sesión</Button>
          </Link>
          <Link href="/registro" onClick={() => setIsOpen(false)}>
            <Button className="w-full justify-start">Crear cuenta</Button>
          </Link>
        </div>
      )}
    </header>
  )
}
