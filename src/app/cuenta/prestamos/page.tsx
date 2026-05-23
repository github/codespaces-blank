import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MisPrestamosPage() {
  // Aquí luego obtendremos los préstamos reales de Supabase
  const hasLoans = false; 

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-[var(--container-xl)]">
      <div className="mb-8">
        <h1 className="type-h2 text-[var(--color-text-primary)] mb-2">Mis Préstamos</h1>
        <p className="type-body text-[var(--color-text-secondary)]">
          Gestiona tus libros reservados y prestados actualmente.
        </p>
      </div>

      {!hasLoans ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[var(--color-border-default)] rounded-xl bg-[var(--color-background-secondary)]">
          <div className="h-16 w-16 rounded-full bg-[var(--color-background-primary)] shadow-sm flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-[var(--color-text-tertiary)]" />
          </div>
          <h3 className="type-h3 text-[var(--color-text-primary)] mb-2">No tienes préstamos activos</h3>
          <p className="type-body text-[var(--color-text-secondary)] max-w-md mb-6">
            Explora nuestro catálogo para encontrar tu próxima lectura.
          </p>
          <Link href="/catalogo"><Button>Ir al Catálogo</Button></Link>
        </div>
      ) : null}
    </div>
  );
}