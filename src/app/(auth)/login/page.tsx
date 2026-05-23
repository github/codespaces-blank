import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string; redirect?: string }
}) {
  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect("/login?message=No se pudo iniciar sesión. Revisa tus credenciales.")
    }

    const redirectTo = searchParams?.redirect || "/cuenta/prestamos"
    return redirect(redirectTo)
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto mt-20 mb-20">
      <div className="text-center mb-8">
        <h1 className="type-h2 mb-2">Bienvenido de nuevo</h1>
        <p className="type-meta text-[var(--color-text-secondary)]">Inicia sesión en tu cuenta de Iqra Al-Ándalus</p>
      </div>

      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-4 text-[var(--color-text-primary)]" action={signIn}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="tu@email.com" required type="email" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Contraseña</Label>
            {/* <Link href="/recuperar-contrasena" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]">
              ¿Olvidaste tu contraseña?
            </Link> */}
          </div>
          <Input type="password" name="password" placeholder="••••••••" required />
        </div>
        
        <Button className="w-full mt-4" type="submit">
          Entrar
        </Button>

        {searchParams?.message && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{searchParams.message}</AlertDescription>
          </Alert>
        )}
      </form>
      
      <div className="text-center mt-6 text-sm text-[var(--color-text-secondary)]">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/registro" className="text-[var(--color-accent-primary)] font-medium hover:underline">
          Regístrate aquí
        </Link>
      </div>
    </div>
  )
}
