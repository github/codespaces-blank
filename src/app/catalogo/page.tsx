import { createClient } from "@/lib/supabase/server";
import { BookCard } from "@/components/BookCard";
import { CatalogFilters } from "@/components/CatalogFilters";
import { BookOpen } from "lucide-react";
import Link from "next/link";

// ISR: Revalida la caché cada 5 minutos para rendimiento extremo sin perder datos frescos.
export const revalidate = 300;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { q?: string; categoria?: string; estado?: string };
}) {
  const supabase = createClient();

  // Construir la query
  let query = supabase.from("books").select("*").neq("status", "archived");

  if (searchParams.q) {
    // Busca tanto en título como en autor
    query = query.or(`title.ilike.%${searchParams.q}%,author.ilike.%${searchParams.q}%`);
  }

  if (searchParams.categoria && searchParams.categoria !== "todas") {
    query = query.eq("category", searchParams.categoria);
  }

  if (searchParams.estado && searchParams.estado !== "todos") {
    if (searchParams.estado === "disponible") {
      query = query.eq("status", "available");
    } else {
      query = query.neq("status", "available");
    }
  }

  // Traer los datos ordenados por fecha de añadido
  const { data: books, error } = await query.order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-[var(--container-xl)]">
      <div className="mb-10">
        <h1 className="type-h1 mb-4 text-[var(--color-text-primary)]">Catálogo de Libros</h1>
        <p className="type-prose text-[var(--color-text-secondary)] max-w-2xl">
          Explora nuestra biblioteca comunitaria. Puedes filtrar por categoría, buscar libros concretos y comprobar su disponibilidad en tiempo real.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-64 shrink-0">
          <CatalogFilters currentCategory={searchParams.categoria} currentStatus={searchParams.estado} currentQuery={searchParams.q} />
        </aside>

        <div className="flex-1">
          {error ? (
            <div className="p-4 bg-[var(--color-status-lost)]/10 text-[var(--color-status-lost)] rounded-md border border-[var(--color-status-lost)]/20">
              Error al cargar el catálogo. Por favor, intenta de nuevo más tarde.
            </div>
          ) : books?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-[var(--color-border-default)] rounded-xl bg-[var(--color-background-secondary)]">
              <div className="h-16 w-16 rounded-full bg-[var(--color-background-primary)] shadow-sm flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-[var(--color-text-tertiary)]" />
              </div>
              <h3 className="type-h3 text-[var(--color-text-primary)] mb-2">No encontramos resultados</h3>
              <p className="type-body text-[var(--color-text-secondary)] max-w-md">
                Intenta ajustar los filtros, limpiar la búsqueda o cambiar de categoría para ver más libros.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books?.map((book) => (
                <Link key={book.id} href={`/reservar/${book.id}`} className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] rounded-md">
                  <BookCard book={book as any} className="h-full group-hover:border-[var(--color-border-strong)]" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
