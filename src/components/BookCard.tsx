import { Badge } from "./ui/badge";

export function BookCard({ book, className = "" }: { book: any; className?: string }) {
  return (
    <div className={`flex flex-col border border-[var(--color-border-default)] rounded-md overflow-hidden bg-[var(--color-background-secondary)] ${className}`}>
      <div className="aspect-[2/3] bg-[var(--color-background-primary)] flex items-center justify-center relative p-4 text-center">
        {book.cover_url ? (
          <img src={book.cover_url} alt={`Portada de ${book.title}`} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <span className="font-serif text-lg font-medium text-[var(--color-accent-primary)] line-clamp-4 relative z-10">{book.title}</span>
        )}
        <div className="absolute top-2 right-2 z-20">
          <Badge variant={book.status === "available" ? "available" : "reserved"}>
            {book.status === "available" ? "Disponible" : "Ocupado"}
          </Badge>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 border-t border-[var(--color-border-subtle)]">
        <h3 className="font-serif font-medium text-[var(--color-text-primary)] line-clamp-2">{book.title}</h3>
        <p className="type-meta mt-1 text-[var(--color-text-secondary)] line-clamp-1">{book.author || 'Autor desconocido'}</p>
        <p className="type-meta mt-auto pt-3 text-[var(--color-text-tertiary)] uppercase tracking-wider">{book.category}</p>
      </div>
    </div>
  );
}