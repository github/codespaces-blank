"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { SignatureCanvas } from "@/components/SignatureCanvas";

export function ReservationForm({ book, userId }: { book: any; userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);

  // UX: Obligar al usuario a hacer scroll hasta el final del acuerdo
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 20) {
      setScrolledToBottom(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted || !signature) return;
    setLoading(true);

    try {
      // 1. Insertamos el préstamo
      const { data: loan, error: loanError } = await supabase.from("loans").insert({
        user_id: userId, book_id: book.id, status: "reserved"
      }).select().single();
      if (loanError) throw loanError;

      // 2. Insertamos el acuerdo legal firmado
      const { error: agreementError } = await supabase.from("loan_agreements").insert({
        loan_id: loan.id, user_id: userId, book_id: book.id,
        checkbox_accepted: true, signature_url: signature, // PNG Base64 de la firma
        agreement_text: "He solicitado el préstamo en fecha...",
      });
      if (agreementError) throw agreementError;

      // 3. Bloqueamos el libro en el catálogo
      await supabase.from("books").update({ status: "reserved" }).eq("id", book.id);

      router.push("/cuenta/prestamos?success=true");
    } catch (error) {
      console.error(error);
      alert("Ha ocurrido un error al procesar tu reserva.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="h-48 overflow-y-auto p-4 border border-[var(--color-border-default)] rounded-md bg-[var(--color-background-primary)] text-sm space-y-4" onScroll={handleScroll}>
        <h3 className="font-bold">Acuerdo de Préstamo - Iqra Al-Ándalus</h3>
        <p>Por la presente, solicito en calidad de préstamo el libro: <strong>{book.title}</strong>.</p>
        <p>1. Me comprometo a devolver el libro en un plazo máximo de 21 días naturales.</p>
        <p>2. Me comprometo a cuidar el material y devolverlo en las mismas condiciones.</p>
        <p>3. Entiendo que la no devolución supondrá el bloqueo de mi cuenta y posibles acciones de recuperación de los costes de reposición del libro.</p>
        <p className="pt-12 pb-4 text-center text-xs text-[var(--color-text-tertiary)]">(Sigue haciendo scroll para continuar)</p>
      </div>

      <div className="flex items-start gap-2">
        <input type="checkbox" id="accept" disabled={!scrolledToBottom} checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1" />
        <label htmlFor="accept" className={`text-sm ${!scrolledToBottom ? "opacity-50" : ""}`}>He leído y acepto íntegramente el Acuerdo de Préstamo.</label>
      </div>

      {accepted && (<div className="space-y-3 animate-in fade-in zoom-in duration-300"><label className="type-meta font-medium">Dibuja tu firma para confirmar:</label><SignatureCanvas onEnd={setSignature} /></div>)}

      <Button type="submit" className="w-full" disabled={!accepted || !signature || loading}>
        {loading ? "Procesando reserva..." : "Confirmar reserva con firma digital"}
      </Button>
    </form>
  );
}