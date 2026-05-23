import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { message?: string, success?: string }
}) {
  const signUp = async (formData: FormData) => {
    "use server"

    const origin = headers().get("origin")
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const full_name = formData.get("full_name") as string
    const gdpr_consent = formData.get("gdpr_consent") === "on"
    
    if (!gdpr_consent) {
        return redirect("/registro?message=Debes aceptar la política de privacidad para continuar.")
    }

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: full_name,
        }
      },
    })

    if (error) {
      return redirect(`/registro?message=${error.message}`)
    }

    return redirect("/registro?success=Revisa tu correo electrónico para verificar tu cuenta.")
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto mt-16 mb-20">
      <div className="text-center mb-8">
        <h1 className="type-h2 mb-2">Crear cuenta</h1>
        <p className="type-meta text-[var(--color-text-secondary)]">Únete a la biblioteca comunitaria</p>
      </div>

      {searchParams?.success ? (
        <Alert variant="success" className="mb-4">
            <AlertDescription>{searchParams.success}</AlertDescription>
        </Alert>
      ) : (
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-[var(--color-text-primary)]" action={signUp}>
            <div className="flex flex-col gap-2">
            <Label htmlFor="full_name">Nombre completo</Label>
            <Input name="full_name" placeholder="Tu nombre" required type="text" />
            </div>
            
            <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="tu@email.com" required type="email" />
            </div>

            <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input type="password" name="password" placeholder="••••••••" required minLength={6} />
            <span className="text-[10px] text-[var(--color-text-tertiary)]">Mínimo 6 caracteres</span>
            </div>

            <div className="flex items-start gap-2 mt-2">
            <input type="checkbox" name="gdpr_consent" id="gdpr_consent" className="mt-1" required />
            <Label htmlFor="gdpr_consent" className="text-xs font-normal text-[var(--color-text-secondary)] leading-tight">
                He leído y acepto la <Link href="/privacidad" className="underline text-[var(--color-accent-primary)]">Política de Privacidad</Link>. Entiendo que mis datos serán tratados para gestionar el préstamo de libros.
            </Label>
            </div>
            
            <Button className="w-full mt-4" type="submit">
            Registrarse
            </Button>

            {searchParams?.message && (
            <Alert variant="destructive" className="mt-4">
                <AlertDescription>{searchParams.message}</AlertDescription>
            </Alert>
            )}
        </form>
      )}
      
      <div className="text-center mt-6 text-sm text-[var(--color-text-secondary)]">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-[var(--color-accent-primary)] font-medium hover:underline">
          Inicia sesión
        </Link>
      </div>
    </div>
  )
}
