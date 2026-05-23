import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { ReservationClient } from "./ReservationClient"

export default async function ReservarPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/reservar/${params.id}`)
  }

  // Fetch user profile to get full name and DNI
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, dni")
    .eq("id", user.id)
    .single()

  const { data: book } = await supabase
    .from("books")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!book) {
    notFound()
  }

  if (book.status !== 'available') {
    return (
      <div className="container mx-auto px-4 max-w-md py-20 text-center">
        <h1 className="type-h2 mb-4">Libro no disponible</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">Este libro actualmente se encuentra {book.status === 'reserved' ? 'reservado' : 'prestado'}.</p>
        <a href="/catalogo" className="text-[var(--color-accent-primary)] hover:underline">Volver al catálogo</a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[var(--container-md)] py-12">
       <ReservationClient 
         book={book} 
         user={{ 
           id: user.id, 
           email: user.email!, 
           full_name: profile?.full_name || '', 
           dni: profile?.dni || '' 
         }} 
       />
    </div>
  )
}
