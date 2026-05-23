import Link from "next/link"
import { Logo } from "./Logo"

export function Footer() {
  return (
    <footer className="w-full bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[var(--container-xl)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          <div className="md:col-span-2">
            <Logo className="text-white mb-4" />
            <p className="text-[var(--carbon-300)] text-sm max-w-sm mb-6">
              Iqra Al-Ándalus es una biblioteca comunitaria sin ánimo de lucro de libros islámicos en español.
            </p>
            <p className="text-xs text-[var(--carbon-400)]">
              "Lee, en el nombre de tu Señor que creó."
            </p>
          </div>

          <div>
            <h3 className="font-serif font-medium text-white mb-4">Proyecto</h3>
            <ul className="flex flex-col gap-3 text-sm text-[var(--carbon-300)]">
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/como-funciona" className="hover:text-white transition-colors">Cómo funciona</Link></li>
              <li><Link href="/donar" className="hover:text-white transition-colors">Donar libros</Link></li>
              <li><Link href="/transparencia" className="hover:text-white transition-colors">Transparencia</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-medium text-white mb-4">Legal y Contacto</h3>
            <ul className="flex flex-col gap-3 text-sm text-[var(--carbon-300)]">
              <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto y Local</Link></li>
              <li><Link href="/normas" className="hover:text-white transition-colors">Normas de préstamo</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link href="/aviso-legal" className="hover:text-white transition-colors">Aviso legal</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-[var(--carbon-700)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--carbon-400)]">
          <p>© {new Date().getFullYear()} Iqra Al-Ándalus. Proyecto comunitario.</p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/aviso-legal" className="hover:text-white transition-colors">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
