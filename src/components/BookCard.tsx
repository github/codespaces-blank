import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/button";
import Image from "next/image";

export interface Book {
  id: string;
  title: string;
  author: string | null;
  category: string | null;
  status: 'available' | 'reserved' | 'borrowed' | 'review' | 'damaged' | 'lost' | 'archived';
  cover_url: string | null;
}

export function BookCard({ book, className }: { book: Book; className?: string }) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'reserved': return 'Reservado';
      case 'borrowed': return 'Prestado';
      case 'lost': return 'Perdido';
      default: return 'No disponible';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available': return 'available';
      case 'reserved': return 'reserved';
      case 'borrowed': return 'borrowed';
      case 'lost': return 'lost';
      default: return 'secondary';
    }
  };

  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-background-elevated)] transition-all hover:border-[var(--color-border-strong)] hover:shadow-md",
      className
    )}>
      {/* Portada */}
      <div className="relative aspect-[2/3] w-full bg-[var(--color-background-secondary)] overflow-hidden">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={`Portada de ${book.title}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] p-4 text-center">
            <span className="font-serif text-sm opacity-50">{book.title}</span>
          </div>
        )}
        
        {/* Badge Flotante */}
        <div className="absolute top-2 right-2 z-10">
          <Badge variant={getStatusVariant(book.status) as any}>
            {getStatusLabel(book.status)}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)]">
          {book.category || 'General'}
        </div>
        <h3 className="font-serif text-base font-medium leading-tight text-[var(--color-text-primary)] mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">
          {book.author || 'Autor desconocido'}
        </p>
      </div>
    </div>
  );
}
