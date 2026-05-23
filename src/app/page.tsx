import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, MapPin, HandHeart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="bg-[var(--color-background-primary)] py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[var(--container-xl)] text-center">
          <p className="type-arabic mb-6">اقرأ باسم ربك الذي خلق</p>
          <p className="type-quote mb-8 max-w-2xl mx-auto">
            "Lee, en el nombre de tu Señor que creó."
          </p>
          <h1 className="type-hero mb-6 text-[var(--color-text-primary)]">
            Tu biblioteca islámica <br className="hidden md:block" />
            <span className="text-[var(--color-accent-primary)]">gratuita</span> en español.
          </h1>
          <p className="type-prose text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto">
            Accede a decenas de libros islámicos contemporáneos de forma totalmente gratuita. 
            Reserva online y recoge en nuestro local.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/catalogo">
              <Button size="lg" className="w-full sm:w-auto">Explorar Catálogo</Button>
            </Link>
            <Link href="/como-funciona">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">¿Cómo funciona?</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section (Mocked for now) */}
      <section className="bg-[var(--color-background-inverse)] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[var(--container-xl)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-[var(--carbon-700)]">
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-serif text-white">45</span>
              <span className="text-sm text-[var(--carbon-400)] uppercase tracking-wider">Libros</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-serif text-white">12</span>
              <span className="text-sm text-[var(--carbon-400)] uppercase tracking-wider">Préstamos activos</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-serif text-white">28</span>
              <span className="text-sm text-[var(--carbon-400)] uppercase tracking-wider">Lectores</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-4xl font-serif text-[var(--color-accent-secondary)]">150€</span>
              <span className="text-sm text-[var(--carbon-400)] uppercase tracking-wider">Hucha</span>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Breve */}
      <section className="bg-[var(--color-background-secondary)] py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[var(--container-xl)]">
          <div className="text-center mb-16">
            <h2 className="type-h2 mb-4">La lectura debe ser accesible</h2>
            <p className="type-prose text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Hemos diseñado un sistema híbrido para que leer no te cueste nada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-[var(--color-background-primary)] flex items-center justify-center mb-6 shadow-sm">
                <BookOpen className="h-8 w-8 text-[var(--color-accent-primary)]" />
              </div>
              <h3 className="type-h3 mb-3">1. Reserva online</h3>
              <p className="text-[var(--color-text-secondary)]">
                Crea una cuenta gratuita, explora nuestro catálogo curado y reserva el libro que quieras leer. Firmas tu acuerdo digitalmente.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-[var(--color-background-primary)] flex items-center justify-center mb-6 shadow-sm">
                <MapPin className="h-8 w-8 text-[var(--color-accent-primary)]" />
              </div>
              <h3 className="type-h3 mb-3">2. Recoge en el local</h3>
              <p className="text-[var(--color-text-secondary)]">
                Acércate a nuestro punto de encuentro con tu email de confirmación y recoge el libro físicamente.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-[var(--color-background-primary)] flex items-center justify-center mb-6 shadow-sm">
                <HandHeart className="h-8 w-8 text-[var(--color-accent-primary)]" />
              </div>
              <h3 className="type-h3 mb-3">3. Lee y devuelve</h3>
              <p className="text-[var(--color-text-secondary)]">
                Tienes 21 días para disfrutar de la lectura. Luego, devuélvelo para que otro hermano o hermana pueda leerlo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-[var(--color-background-primary)] py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[var(--container-md)] text-center">
          <h2 className="type-h2 mb-6">El conocimiento crece cuando se comparte</h2>
          <p className="type-prose text-[var(--color-text-secondary)] mb-10">
            Únete a nuestra comunidad de lectores y ayúdanos a hacer accesible el conocimiento a todos.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/registro">
              <Button size="lg">Crear cuenta gratis</Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
