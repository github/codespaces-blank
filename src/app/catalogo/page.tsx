import { createClient } from "@/utils/supabase/server"
import { BookCard, type Book } from "@/components/BookCard"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Forzamos ISR revalidando cada 5 minutos
export const revalidate = 300

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: { q?: string; categoria?: string; estado?: string }
}) {
  const supabase = createClient()

  // Construir la query
  let query = supabase
    .from("books")
    .select("id, title, author, category, status, cover_url")
    .neq("status", "archived")

  if (searchParams?.q) {
    query = query.or(`title.ilike.%${searchParams.q}%,author.ilike.%${searchParams.q}%`)
  }

  if (searchParams?.categoria) {
    query = query.eq("category", searchParams.categoria)
  }

  if (searchParams?.estado) {
    query = query.eq("status", searchParams.estado)
  }

  // Ordenar por disponibles primero, luego por título
  query = query.order("status", { ascending: true }).order("title", { ascending: true })

  const { data: books, error } = await query

  const categorias = ["aqida", "fiqh", "sira", "hadiz", "tafsir", "familia", "tazkiyah", "historia", "juventud", "mujer", "conversos", "otros"]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[var(--container-xl)] py-12">
      <div className="mb-12">
        <h1 className="type-h1 mb-4">Catálogo</h1>
        <p className="type-prose text-[var(--color-text-secondary)]">Explora nuestra colección y reserva tu próximo libro.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar / Filtros */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 flex flex-col gap-8">
          {/* Búsqueda (UI mockup, logic needed) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Buscar título o autor..." 
              className="pl-9"
              defaultValue={searchParams?.q}
            />
          </div>

          <div>
            <h3 className="type-eyebrow mb-3">Categorías</h3>
            <div className="flex flex-wrap lg:flex-col gap-2">
              {categorias.map(cat => (
                <a 
                  key={cat}
                  href={`/catalogo?categoria=${cat}`} 
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    searchParams?.categoria === cat 
                    ? "bg-[var(--color-accent-primary)] text-white border-[var(--color-accent-primary)]" 
                    : "border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)]"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid de Libros */}
        <div className="flex-1 w-full">
          {error ? (
             <div className="p-8 text-center bg-[var(--color-background-secondary)] rounded-lg border border-[var(--color-state-danger)]/20 text-[var(--color-state-danger)]">
               Error al cargar el catálogo. Por favor, intenta de nuevo más tarde.
             </div>
          ) : !books || books.length === 0 ? (
            <div className="p-16 text-center bg-[var(--color-background-secondary)] rounded-lg border border-[var(--color-border-subtle)]">
              <h3 className="type-h3 mb-2">No se encontraron libros</h3>
              <p className="text-[var(--color-text-secondary)]">Prueba a cambiar los filtros de búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {books.map((book) => (
                <a key={book.id} href={`#libro-${book.id}`} className="block h-full">
                  <BookCard book={book as Book} className="h-full" />
                </a>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}
