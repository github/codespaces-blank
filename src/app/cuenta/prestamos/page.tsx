import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function CuentaPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  // Fetch active loans
  const { data: loans, error } = await supabase
    .from("loans")
    .select(`
      id,
      status,
      reserved_at,
      due_date,
      book:books(title, author, cover_url)
    `)
    .eq("user_id", user.id)
    .in("status", ["reserved", "active", "overdue"])
    .order("reserved_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[var(--container-md)] py-12">
      <div className="mb-8 border-b border-[var(--color-border-subtle)] pb-6">
        <h1 className="type-h2 mb-2">Mis Préstamos</h1>
        <p className="type-meta text-[var(--color-text-secondary)]">
          Gestiona tus reservas y devoluciones
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {error ? (
          <p className="text-red-500 text-sm">Error cargando préstamos.</p>
        ) : !loans || loans.length === 0 ? (
          <div className="text-center py-12 bg-[var(--color-background-secondary)] rounded-lg">
            <p className="text-[var(--color-text-secondary)]">No tienes ningún préstamo activo.</p>
            <a href="/catalogo" className="text-[var(--color-accent-primary)] hover:underline mt-2 inline-block font-medium">Explorar el catálogo</a>
          </div>
        ) : (
          loans.map((loan) => (
            <div key={loan.id} className="flex gap-4 p-4 border border-[var(--color-border-subtle)] rounded-lg bg-[var(--color-background-primary)]">
               <div className="w-16 h-24 bg-[var(--color-background-secondary)] rounded-md overflow-hidden flex-shrink-0 relative">
                 {loan.book?.cover_url && (
                   <img src={loan.book.cover_url} alt="Cover" className="object-cover w-full h-full" />
                 )}
               </div>
               <div className="flex flex-col flex-1 justify-center">
                 <h3 className="font-serif font-medium">{loan.book?.title}</h3>
                 <p className="text-xs text-[var(--color-text-secondary)] mb-2">{loan.book?.author}</p>
                 
                 <div className="flex items-center gap-2 mt-auto">
                    <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-status-reserved)]/10 text-[var(--color-status-reserved)] font-medium uppercase tracking-wider">
                      {loan.status === 'reserved' ? 'Reservado' : loan.status === 'active' ? 'Activo' : 'Retrasado'}
                    </span>
                    {loan.status === 'reserved' && (
                       <span className="text-xs text-[var(--color-text-tertiary)]">Pendiente de recoger</span>
                    )}
                 </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
