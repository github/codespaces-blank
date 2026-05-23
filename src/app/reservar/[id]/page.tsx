import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReservationForm } from "./ReservationForm";

export default async function ReservarPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect(`/login?redirect=/reservar/${params.id}`);
  }

  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl bg-[var(--color-background-primary)] rounded-xl border border-[var(--color-border-default)]">
        <h1 className="type-h2 mb-4 text-[var(--color-text-primary)]">Libro no encontrado</h1>
        <p className="type-body text-[var(--color-text-secondary)]">El libro que intentas reservar no existe o ha sido retirado de la biblioteca.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-[var(--container-xl)]">
      <div className="max-w-2xl mx-auto bg-[var(--color-background-primary)] rounded-xl border border-[var(--color-border-default)] p-6 sm:p-10 shadow-sm">
        <div className="mb-8 border-b border-[var(--color-border-subtle)] pb-6">
          <h1 className="type-h2 text-[var(--color-text-primary)] mb-2">Reservar Libro</h1>
          <p className="type-body text-[var(--color-text-secondary)]">
            Estás a punto de solicitar el préstamo de <strong>{book.title}</strong>.
          </p>
        </div>
        
        <ReservationForm book={book} userId={session.user.id} />
      </div>
    </div>
  );
}