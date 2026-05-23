'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SignaturePad from 'signature_pad'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export function ReservationClient({ book, user }: { book: any, user: any }) {
  const [step, setStep] = useState(1) // 1: Acuerdo, 2: Firma, 3: Confirmado
  const [canProceedToSign, setCanProceedToSign] = useState(false)
  const agreementRef = useRef<HTMLDivElement>(null)
  
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signaturePadRef = useRef<SignaturePad | null>(null)
  const router = useRouter()

  // Step 1: Detectar scroll al final del acuerdo
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      setCanProceedToSign(true)
    }
  }

  // Inicializar canvas
  useEffect(() => {
    if (step === 2 && canvasRef.current) {
      const canvas = canvasRef.current;
      
      // Handle high DPI displays
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);

      signaturePadRef.current = new SignaturePad(canvas, {
        penColor: 'rgb(26, 26, 26)', // var(--carbon-800)
        backgroundColor: 'rgb(250, 250, 247)' // var(--ivory-100)
      })
    }
  }, [step])

  const clearSignature = () => {
    signaturePadRef.current?.clear()
  }

  const confirmReservation = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      setError("Debes dibujar tu firma para continuar.")
      return
    }

    const form = e.target as HTMLFormElement
    const checkbox = form.elements.namedItem('accept') as HTMLInputElement
    
    if (!checkbox.checked) {
      setError("Debes aceptar el acuerdo.")
      return
    }

    setIsSubmitting(true)
    
    try {
      const dataUrl = signaturePadRef.current.toDataURL('image/png')
      const supabase = createClient()
      
      // Lógica simplificada para V1. En el mundo real aquí generamos el PDF y subimos a Storage.
      // Por ahora, solo creamos el registro en la BD.

      // 1. Crear el préstamo
      const { data: loan, error: loanError } = await supabase
        .from('loans')
        .insert({
          user_id: user.id,
          book_id: book.id,
          status: 'reserved'
        })
        .select()
        .single()

      if (loanError) throw loanError

      // 2. Crear el acuerdo
      const { error: agreementError } = await supabase
        .from('loan_agreements')
        .insert({
          loan_id: loan.id,
          user_id: user.id,
          book_id: book.id,
          checkbox_accepted: true,
          // signature_url y pdf_url se procesarían en Edge Function o Server Action real
        })

      if (agreementError) throw agreementError

      // 3. Actualizar estado del libro
      const { error: bookError } = await supabase
        .from('books')
        .update({ status: 'reserved' })
        .eq('id', book.id)

      if (bookError) throw bookError

      setStep(3)
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al procesar la reserva.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (step === 3) {
    return (
      <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="type-h2 mb-4">¡Reserva confirmada!</h2>
        <p className="type-prose text-[var(--color-text-secondary)] mb-8">
          Has reservado <strong>{book.title}</strong>.<br/>
          Tienes 72 horas para recogerlo en el local.
        </p>
        <Button onClick={() => router.push('/cuenta/prestamos')}>Ver mis préstamos</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progreso */}
      <div className="flex items-center justify-between mb-8 text-sm font-medium">
         <span className={step === 1 ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-tertiary)]"}>1. Acuerdo</span>
         <div className="h-px bg-[var(--color-border-subtle)] flex-1 mx-4" />
         <span className={step === 2 ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-tertiary)]"}>2. Firma</span>
      </div>

      <div className="bg-[var(--color-background-elevated)] border border-[var(--color-border-subtle)] rounded-lg overflow-hidden flex flex-col sm:flex-row mb-8">
         <div className="w-24 bg-[var(--color-background-secondary)] shrink-0 hidden sm:block">
           {book.cover_url && <img src={book.cover_url} alt="" className="w-full h-full object-cover" />}
         </div>
         <div className="p-4 flex flex-col justify-center">
           <h2 className="font-serif font-medium text-lg leading-tight mb-1">{book.title}</h2>
           <p className="text-sm text-[var(--color-text-secondary)]">{book.author}</p>
         </div>
      </div>

      {step === 1 && (
        <div className="animate-in fade-in">
          <div 
            className="h-64 sm:h-96 overflow-y-auto p-6 bg-[var(--color-background-primary)] border border-[var(--color-border-default)] rounded-lg mb-6 text-sm text-[var(--color-text-secondary)] space-y-4 shadow-inner"
            onScroll={handleScroll}
            ref={agreementRef}
          >
            <h3 className="font-serif font-medium text-base text-[var(--color-text-primary)]">Acuerdo de Préstamo de Biblioteca</h3>
            <p>Al confirmar esta reserva, usted (el usuario) acuerda tomar prestado el material bibliográfico seleccionado bajo las siguientes condiciones:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>El préstamo tiene una duración máxima de 21 días naturales desde la fecha de recogida.</li>
              <li>El material debe ser devuelto en el mismo estado de conservación en el que fue entregado.</li>
              <li>En caso de deterioro grave o pérdida, el usuario se compromete a abonar el coste de reposición íntegro del ejemplar.</li>
              <li>La biblioteca enviará recordatorios automáticos al acercarse y superar la fecha límite.</li>
              <li>Este acuerdo tiene validez legal bajo el Reglamento eIDAS y se almacena un registro de la firma electrónica junto con la IP y marca de tiempo.</li>
            </ul>
            <p className="italic">Por favor, lea hasta el final para continuar.</p>
            {/* Simulando texto largo */}
            <div className="h-32"></div>
            <p className="font-medium text-[var(--color-text-primary)]">Fin del documento.</p>
          </div>

          <Button 
            className="w-full" 
            disabled={!canProceedToSign}
            onClick={() => setStep(2)}
          >
            Continuar a la firma
          </Button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={confirmReservation} className="animate-in slide-in-from-right-4">
          <div className="mb-6 p-4 bg-[var(--color-background-secondary)] rounded-lg text-sm flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-tertiary)]">Usuario:</span>
              <span className="font-medium">{user.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-tertiary)]">DNI/NIE:</span>
              <span className="font-medium">***{user.dni?.slice(-3) || '000'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text-tertiary)]">Fecha:</span>
              <span className="font-medium">{new Date().toLocaleDateString('es-ES')}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" name="accept" className="mt-1 w-4 h-4" required />
              <span className="text-sm font-medium leading-tight text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">
                He leído y acepto íntegramente el Acuerdo de Préstamo de la Biblioteca Iqra Al-Ándalus para este ejemplar.
              </span>
            </label>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">Firma del usuario</span>
              <button type="button" onClick={clearSignature} className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]">Limpiar firma</button>
            </div>
            <div className="border border-[var(--color-border-default)] bg-[var(--color-background-primary)] rounded-lg overflow-hidden">
               <canvas ref={canvasRef} className="w-full h-48 sm:h-64 cursor-crosshair touch-none"></canvas>
            </div>
          </div>

          {error && <Alert variant="destructive" className="mb-6"><AlertDescription>{error}</AlertDescription></Alert>}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={isSubmitting}>Atrás</Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "Confirmar reserva"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
